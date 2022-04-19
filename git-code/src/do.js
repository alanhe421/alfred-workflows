/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, http } = require('@stacker/alfred-utils');
const { Workflow } = require('@stacker/alfred-utils/dist/workflow');
const [, , query] = process.argv;
const wf = new Workflow();
(async function () {
  if (query === 'archive_project') {
    archiveProject(
      process.env.access_token,
      process.env.base_url,
      process.env.score
    );
  }
})();

async function archiveProject(token, baseUrl, score) {
  try {
    const instance = http.createHttpClient(baseUrl);
    const res = await instance.get('/api/v3/projects', {
      params: {
        private_token: token,
        page: 1,
        per_page: process.env.per_page || 20,
        sort: 'desc',
        order_by: 'last_activity_at',
        search: query
      }
    });
    if (res.data.length === 0) {
      wf.addWorkflowItem({
        item: utils.buildItem({
          title: `Search for '${query}'`,
          subtitle: `Goto ${baseUrl}`,
          arg: `${baseUrl}/primarySearch?search=${query}`
        }),
        score
      });
      return;
    }
    res.data.forEach((item) => {
      wf.addWorkflowItem({
        item: utils.buildItem({
          uid: item.name_with_namespace,
          title: item.name_with_namespace,
          subtitle: item.description,
          arg: item.web_url,
          autocomplete: item.name_with_namespace,
          mods: {
            cmd: {
              arg: item.ssh_url_to_repo,
              subtitle: `⏎ to Copy SSH URL:${item.ssh_url_to_repo}`
            },
            alt: {
              variables: {
                projectId: item.id,
                projectName: item.name_with_namespace,
                token,
                baseUrl
              }
            }
          }
        }),
        score
      });
    });
    return;
  } catch (e) {
    wf.addWorkflowItem({
      item: utils.buildItem({
        title: baseUrl,
        subtitle: 'something wrong:' + e
      }),
      score
    });
    return;
  }
}

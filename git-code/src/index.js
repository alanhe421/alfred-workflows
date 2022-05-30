/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, http } = require('@stacker/alfred-utils');
const { Workflow } = require('@stacker/alfred-utils/dist/workflow');
const [, , query] = process.argv;
const wf = new Workflow();
(async function () {
  if (!process.env.access_token_1 || !process.env.base_url_1) {
    utils.printScriptFilter({
      items: [
        utils.buildItem({
          title: 'token or url missing',
          subtitle: 'You need to setup at least one git - environment variable'
        })
      ]
    });
    return;
  }

  const gitPromises = [];
  let index = 1;
  function indexStr(prefix) {
    return `${prefix}_${String(index)}`;
  }
  while (
    process.env[indexStr('access_token')] &&
    process.env[indexStr('base_url')]
  ) {
    gitPromises.push(
      searchProjects(
        process.env[indexStr('access_token')],
        process.env[indexStr('base_url')],
        process.env[indexStr('score')]
      )
    );
    index += 1;
  }

  await Promise.all(gitPromises);
  utils.printScriptFilter({
    items: wf.convertWorkflowItems()
  });
})();

async function searchProjects(token, baseUrl, score) {
  if (!token || !baseUrl) {
    return;
  }
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
          subtitle:
            (item.archived ? '🔒Archived project , ' : '') + item.description,
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

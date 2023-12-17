/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { http } = require('@stacker/alfred-utils');
const { Workflow } = require('@stacker/alfred-utils/dist/workflow');
const { input } = require('@stacker/alfred-utils/dist');
const client = http.createHttpClient(process.env.baseUrl);
const wf = new Workflow();
(async function () {
  try {
    const branches = (
      await client.get(
        `/api/v3/projects/${process.env.projectId}/repository/branches`,
        {
          headers: {
            'PRIVATE-TOKEN': process.env.token
          }
        }
      )
    ).data;
    branches.forEach((item) => {
      const subtitleArr = [item.commit.author_name, item.commit.title];
      wf.addWorkflowItem({
        item: {
          title: item.name,
          subtitle:
            (item.protected ? '🔒' : '') +
            subtitleArr.filter(Boolean).join(','),
          arg: `tree/${item.name}`,
          text: {
            copy: `${process.env.baseUrl}/${process.env.projectPath}/tree/${item.name}`
          },
          mods: {
            alt: {
              arg: item.name
            }
          }
        }
      });
    });
    wf.filterWorkflowItemsBy(input, ['title']);
    wf.run();
  } catch (e) {
    console.error(e);
  }
})();

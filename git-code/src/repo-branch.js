/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { http } = require('@stacker/alfred-utils');
const { Workflow } = require('@stacker/alfred-utils/dist/workflow');
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
      const subtitleArr = [item.protected ? 'protected' : null];
      wf.addWorkflowItem({
        item: {
          title: item.name,
          subtitle: subtitleArr.filter(Boolean).join(','),
          arg: `tree/${item.name}`
        }
      });
    });
    wf.run();
  } catch (e) {
    console.error(e);
  }
})();

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const {http} = require('@stacker/alfred-utils');
const {Workflow} = require('@stacker/alfred-utils/dist/workflow');
const {input} = require('@stacker/alfred-utils/dist');
const client = http.createHttpClient(process.env.baseUrl);
const wf = new Workflow();
(async function () {
  try {
    const branches = (await client.get(`/api/v3/projects/${process.env.projectId}/repository/tags`, {
      headers: {
        'PRIVATE-TOKEN': process.env.token
      }
    })).data;
    branches.forEach((item) => {
      wf.addWorkflowItem({
        item: {
          title: item.name,
          subtitle: [item.commit.author_name, new Date(item.commit.committed_date).toLocaleTimeString(), item.commit.message].join(','),
          arg: `-/tags/${item.name}`,
          mods: {}
        }
      });
    });
    wf.filterWorkflowItemsBy(input, ['title']);
    wf.run();
  } catch (e) {
    console.error(e);
  }
})();

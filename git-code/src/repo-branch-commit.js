/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const {Workflow} = require('@stacker/alfred-utils/dist/workflow');
const {http} = require("@stacker/alfred-utils");
const [, , branch] = process.argv;
const client = http.createHttpClient(process.env.baseUrl);
client.defaults.headers['PRIVATE-TOKEN'] = process.env.token;

const wf = new Workflow();
(async function () {
  try {
    const commits = (await client.get(`/api/v3/projects/${process.env.projectId}/repository/commits`, {
      ref_name: branch, per_page: 20
    })).data;
    commits.forEach((item) => {
      wf.addWorkflowItem({
        item: {
          title: item.title,
          subtitle: [item.author_name, new Date(item.committed_date).toLocaleTimeString(), item.message].join(','),
          arg: `commit/${item.id}`,
          text: {
            copy: `${process.env.baseUrl}/${process.env.projectPath}/commit/${item.id}`
          }
        }
      });
    });
    wf.run();
  } catch (e) {
    console.error(e);
  }
})();

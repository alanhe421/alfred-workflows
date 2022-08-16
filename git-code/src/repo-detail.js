/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const {utils, http} = require('@stacker/alfred-utils');
const {Workflow} = require('@stacker/alfred-utils/dist/workflow');
const [, , query] = process.argv;
const wf = new Workflow();
(async function () {
  wf.addWorkflowItem({
    item: {
      title: 'Merge Request', arg: 'merge_requests'
    }
  }).addWorkflowItem({
    item: {
      title: 'Issues', arg: 'issues'
    }
  }).addWorkflowItem({
    item: {
      title: 'Archive project', arg: 'archive_project'
    }
  }).addWorkflowItem({
    item: {
      title: 'Branch',
      arg: '-/branches',
    }
  })
    .run();

})();


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
      title: 'Merge Request', arg: 'merge_requests',
      text: {
        copy: `${process.env.baseUrl}/${process.env.projectPath}/merge_requests`
      },
    }
  }).addWorkflowItem({
    item: {
      title: 'Issues', arg: 'issues',
      text: {
        copy: `${process.env.baseUrl}/${process.env.projectPath}/issues`
      },
    }
  }).addWorkflowItem({
    item: {
      title: 'Archive project', arg: 'archive_project'
    }
  }).addWorkflowItem({
    item: {
      title: 'Branch',
      arg: '-/branches',
      text: {
        copy: `${process.env.baseUrl}/${process.env.projectPath}/-/branches`
      },
    }
  }).addWorkflowItem({
      item: {
        title: 'Tag',
        arg: '-/tags',
        text: {
          copy: `${process.env.baseUrl}/${process.env.projectPath}/-/tags`
        },
      }
  })
    .addWorkflowItem({
      item: {
        title: 'Settings - Branches',
        arg: '-/protected_branches?tab=unprotected_branch_rules',
        text: {
          copy: `${process.env.baseUrl}/${process.env.projectPath}/-/protected_branches?tab=unprotected_branch_rules`
        },
      }
    })
    .addWorkflowItem({
      item: {
        title: 'Settings - AI',
        arg: '-/advanced_settings/ai_config',
        text: {
          copy: `${process.env.baseUrl}/${process.env.projectPath}/-/advanced_settings/ai_config`
        },
      }
    })
    .run();

})();


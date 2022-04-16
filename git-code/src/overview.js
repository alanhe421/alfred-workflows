/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, http } = require('@stacker/alfred-utils');
const { Workflow } = require('@stacker/alfred-utils/dist/workflow');
const [, , query] = process.argv;
const wf = new Workflow();
(async function () {
  wf.addWorkflowItem({
    item: utils.buildItem({
      title: 'Merge Request',
      arg: 'merge_requests',
      autocomplete: 'Merge Request'
    })
  });
  wf.addWorkflowItem({
    item: utils.buildItem({
      title: 'Issues',
      arg: 'issues',
      autocomplete: 'Issues'
    })
  });
  wf.addWorkflowItem({
    item: utils.buildItem({
      title: 'Repository Setting',
      subtitle: 'archive/transfer .etc',
      arg: '-/advanced_settings/repository',
      autocomplete: 'Repository Setting'
    })
  });
  utils.printScriptFilter({ items: wf.convertWorkflowItems() });
})();

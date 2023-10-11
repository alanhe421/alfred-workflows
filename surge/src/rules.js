const [, , query] = process.argv;
const {utils, Workflow,} = require('@stacker/alfred-utils');
const {escapeRegexMeta, readConfFromLocal} = require("./utils");

const instance = require('./axios').createHttpClient(process.env.HTTP_API);
const wf = new Workflow();

function isSelectedRule(rule, totalConfContent) {
  if (!totalConfContent) {
    return '';
  }
  return !totalConfContent.match(new RegExp(`# *${escapeRegexMeta(rule)}`))
}

async function main() {
  const rules = await instance.get('/v1/rules').then((res) => res.data.rules);
  let cnfContent = null;
  if (process.env.CONF_FILE_LOCATION) {
    const profileName = await instance
      .get('/v1/profiles/current')
      .then((res) => res.data.name);
    let {content} = await readConfFromLocal(profileName + '.conf');
    cnfContent = content;
  }
  rules.forEach((item) => {
    wf.addWorkflowItem({
      item: {
        title: item,
        subtitle: (isSelectedRule(item, cnfContent) ? utils.emoji.checked : '') + item,
        arg: item,
        text: {
          copy: item, largetype: item
        }
      }
    })
  });
  wf.filterWorkflowItemsBy(query, ['title', 'subtitle']);
  wf.run({
    variables:{
      keyword:query
    }
  });
}

main();

const [, , query] = process.argv;
const {utils} = require('@stacker/alfred-utils');
const path = require('path');
const {readFileSync} = require('fs');
const {escapeRegexMeta} = require("./utils");

const instance = require('./axios').createHttpClient(process.env.HTTP_API);
const limit = 30;

async function readConfFromLocal() {
  const profileName = await instance
    .get('/v1/profiles/current')
    .then((res) => res.data.name);
  const file = path.join(process.env.CONF_FILE_LOCATION, profileName + '.conf');
  return readFileSync(file, {encoding: 'utf8'});
}

function isSelectedRule(rule, totalConfContent) {
  if (!totalConfContent) {
    return '';
  }
  return totalConfContent.match(new RegExp(`# *${escapeRegexMeta(rule)}`))
}

async function main() {
  const rules = await instance.get('/v1/rules').then((res) => res.data.rules);
  let cnfContent = null;
  if (process.env.CONF_FILE_LOCATION) {
    cnfContent = await readConfFromLocal();
  }
  const items = rules.map((item) => {
    return ({
      uid: item,
      title: item.length > limit ? item.substring(0, limit - 3) + '...' : item,
      subtitle: (isSelectedRule(item, cnfContent) ? utils.emoji.checked : '') + item,
      arg: item,
      text: {
        copy: item, largetype: item
      }
    });
  });

  utils.outputScriptFilter({
    items: utils.filterItemsBy(items, query, 'title', 'subtitle')
  });
}

main();

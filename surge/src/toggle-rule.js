const [, , rule] = process.argv;
const {writeFileSync} = require('fs');
const path = require('path');
const {escapeRegexMeta, readConfFromLocal} = require("./utils");

const instance = require('./axios').createHttpClient(process.env.HTTP_API);

async function main() {
  const profileName = await instance
    .get('/v1/profiles/current')
    .then((res) => res.data.name);
  let {content, name} = await readConfFromLocal(profileName + '.conf')
  content = content.replace(new RegExp(`#? *${escapeRegexMeta(rule)}([^\\n]*)`), (match, p1) => {
    return match.startsWith('#') ? rule + p1 : '# ' + rule + p1;
  });
  writeFileSync(path.join(process.env.CONF_FILE_LOCATION, name), content, {encoding: 'utf8'});
}

main();

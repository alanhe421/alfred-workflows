const [, , rule] = process.argv;
const {readFileSync, writeFileSync} = require('fs');
const path = require('path');
const {escapeRegexMeta} = require("./utils");

const instance = require('./axios').createHttpClient(process.env.HTTP_API);

async function main() {
  const profileName = await instance
    .get('/v1/profiles/current')
    .then((res) => res.data.name);
  const file = path.join(process.env.CONF_FILE_LOCATION, profileName + '.conf');
  let content = readFileSync(file, {encoding: 'utf8'});
  content = content.replace(new RegExp(`#? *${escapeRegexMeta(rule)}([^\\n]*)`), (match, p1) => {
    return match.startsWith('#') ? rule + p1 : '# ' + rule + p1;
  });
  writeFileSync(file, content, {encoding: 'utf8'});
}

main();

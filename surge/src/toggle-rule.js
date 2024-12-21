const [, , rule] = process.argv;
const { writeFileSync } = require('fs');
const path = require('path');
const { escapeRegexMeta, readConfFromLocal } = require("./utils");

const instance = require('./axios').createHttpClient(process.env.HTTP_API);


/**
 * 
 */
async function main() {
  const isSelected = process.env.isSelected == '1';
  const profileName = await instance
    .get('/v1/profiles/current')
    .then((res) => res.data.name);
  let { content, name } = await readConfFromLocal(`${profileName}.conf`);
  content = content.replace(new RegExp(`${isSelected ? '' : '#\\s*'}${escapeRegexMeta(rule)}`), `${isSelected ? '# ' : ''}${rule}`);
  writeFileSync(path.join(process.env.CONF_FILE_LOCATION, name), content, { encoding: 'utf8' });
}

main();

const [, , query] = process.argv;
const { utils } = require('@stacker/alfred-utils');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const instance = require('./axios').createHttpClient(process.env.HTTP_API);

async function main() {
  const profileName = await instance
    .get('/v1/profiles/current')
    .then((res) => res.data.name);
  const file = path.join(process.env.CONF_FILE_LOCATION, profileName + '.conf');
  let content = readFileSync(file, { encoding: 'utf8' });

  const idx = content.indexOf(query);
  if (content[idx - 1] === '#') {
    content = content.substring(0, idx - 1) + content.substring(idx);
  } else {
    content = content.substring(0, idx - 1) + '\n#' + content.substring(idx);
  }
  writeFileSync(file, content, { encoding: 'utf8' });
}

main();

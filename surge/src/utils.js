const path = require("path");
const {readFileSync} = require("fs");

function escapeRegexMeta(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


/**
 * 支持Detached Profile Rule读取
 * @returns {Promise<string>}
 */
async function readConfFromLocal(profileName) {
  const file = path.join(process.env.CONF_FILE_LOCATION, profileName);
  let profileCnt = readFileSync(file, {encoding: 'utf8'});
  let detachedRuleProfileName = profileCnt.match(/(?<=\[Rule]\n+#!include\s+).+/)?.[0];
  if (detachedRuleProfileName) {
    return readConfFromLocal(detachedRuleProfileName)
  }
  return {
    name: profileName, content: profileCnt
  };
}

module.exports = {
  escapeRegexMeta,
  readConfFromLocal
}

function encodeDir(dir) {
  return dir.replace(/(\s+)/g, '\\$1');
}

let [, , dir] = process.argv;
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const PREFS_FILE = require(process.env.HOME +
  '/Library/Application Support/Alfred/prefs.json').current;
const WORKFLOWS = PREFS_FILE + '/workflows';
const { execSync } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const workflow_file_suffix = '.alfredworkflow';

const files = fs.readdirSync(dir);
if (
  files.length === 0 ||
  files.every((file) => !file.endsWith(workflow_file_suffix))
) {
  console.log(1);
}
files.forEach((file) => {
  const extension = path.extname(file);
  const tempFileName = file.substring(0, file.lastIndexOf('.')) + '.zip';
  if (extension !== workflow_file_suffix) {
    return;
  }
  const compressedFilename = '11111user.workflow.' + uuidv4();
  let command = `cp ${encodeDir(`${dir}/${file}`)} ${encodeDir(
    `${WORKFLOWS}/${tempFileName}`
  )}`;
  command += ` && unzip ${encodeDir(WORKFLOWS)}/${tempFileName} -d ${encodeDir(
    WORKFLOWS
  )}/${compressedFilename} `;
  command += ` && rm ${encodeDir(WORKFLOWS)}/${tempFileName}`;
  execSync(command);
});
console.log(0);

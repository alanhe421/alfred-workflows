const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const plist = require('plist');
const querystring = require('querystring');

function updateReadme(workflowFolder, plistObj, workflow) {
  const version = plistObj.version;
  const readme = plistObj.readme;
  const readmeFile = workflowFolder + '/README.md';
  const filename = querystring.escape(path.basename(workflow));

  try {
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    let newContent = `${readme}\n\n
[![](https://img.shields.io/badge/version-v${version}-green)](./${filename})
\n\n
<!-- more -->`;
    // 有则更新，无则添加
    if (readmeContent.match(/^(\s|\S)+(\<\!\-\- more \-\-\>)/)) {
      readmeContent = readmeContent.replace(/^(\s|\S)+(\<\!\-\- more \-\-\>)/, newContent)
    } else {
      readmeContent = newContent + readmeContent;
    }
    fs.writeFileSync(readmeFile, readmeContent);
  } catch (e) {
    console.log(e);
  }
}

function parseWorkflowInfo(workflowFolder, workflow) {
  const workFlowFile = workflowFolder + '/' + workflow;
  const workFlowZipFile = workflowFolder + '/temp.zip';
  fs.copyFileSync(workFlowFile, workFlowZipFile);
  const workFlowUnzipFolder = workFlowZipFile.substring(0, workFlowZipFile.length - 4);
  execSync(`unzip -o ${workFlowZipFile} -d ${workFlowUnzipFolder}`);
  execSync(`rm -rf ${workFlowZipFile}`);
  const plistObj = plist.parse(fs.readFileSync(`${workFlowUnzipFolder}/info.plist`, 'utf8'));
  execSync(`mv ${workFlowUnzipFolder}/info.plist ${workflowFolder}/`);
  execSync(`rm -rf ${workFlowUnzipFolder}`);
  return {plistObj};
}

function readAllWorkflows() {
  const targetFolder = path.resolve(__dirname, '../../');
  const folders = fs.readdirSync(targetFolder);
  folders.forEach((folder) => {
    const workflowFolder = targetFolder + '/' + folder;
    const stat = fs.lstatSync(workflowFolder);
    if (stat.isFile()) {
      return;
    }
    if (folder.match(/^\./)) {
      return;
    }
    const files = fs.readdirSync(workflowFolder);
    const workflow = files.find(f => f.match(/\.alfredworkflow$/));
    if (!workflow) {
      return;
    }
    try {
      const {plistObj} = parseWorkflowInfo(workflowFolder, workflow);
      updateReadme(workflowFolder, plistObj, workflow);
    } catch (e) {
      console.error(e);
    }
  })
}

function main() {
  readAllWorkflows();
}

main();

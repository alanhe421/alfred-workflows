const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const plist = require('plist');
const querystring = require('querystring');

function updateReadme(absoluteWorkflowFolder, folderName, plistObj, workflow) {
  const version = plistObj.version;
  const readme = plistObj.readme;
  const readmeFile = absoluteWorkflowFolder + '/README.md';
  const filename = querystring.escape(path.basename(workflow));

  try {
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    let newContent = `${readme}\n\n
![](https://img.shields.io/badge/version-v${version}-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/${process.env.GITHUB_REPOSITORY}/raw/${process.env.GITHUB_REF_NAME}/${folderName}/${filename})
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

/**
 * 保存workflow源码文件，方便PR对比
 * @param workflowFolder
 * @param workflow
 * @returns {{plistObj: *}}
 */
function parseWorkflowInfo(workflowFolder, workflow) {
  const workFlowFile = workflowFolder + '/' + workflow;
  const zip_suffix = '.zip';
  const workFlowZipFile = workflowFolder + '/src' + zip_suffix
  fs.copyFileSync(workFlowFile, workFlowZipFile);
  // 解压zip文件，创建文件夹
  const workFlowUnzipFolder = workFlowZipFile.substring(0, workFlowZipFile.length - zip_suffix.length);
  execSync(`unzip -o ${workFlowZipFile} -d ${workFlowUnzipFolder}`);
  execSync(`rm -rf ${workFlowZipFile}`);
  execSync(`cp ${workFlowUnzipFolder}/info.plist ${workflowFolder}/`);
  // 源码中node_modules不纳入版本管理
  execSync(`rm -rf ${workFlowUnzipFolder}/node_modules`);
  const plistObj = plist.parse(fs.readFileSync(`${workFlowUnzipFolder}/info.plist`, 'utf8'));
  return {plistObj};
}

function readAllWorkflows() {
  const targetFolder = path.resolve(__dirname, '../../');
  const folders = fs.readdirSync(targetFolder);
  folders.forEach((folderName) => {
    const workflowFolder = targetFolder + '/' + folderName;
    const stat = fs.lstatSync(workflowFolder);
    if (stat.isFile()) {
      return;
    }
    if (folderName.match(/^\./)) {
      return;
    }
    const files = fs.readdirSync(workflowFolder);
    const workflow = files.find(f => f.match(/\.alfredworkflow$/));
    if (!workflow) {
      return;
    }
    try {
      const {plistObj} = parseWorkflowInfo(workflowFolder, workflow);
      updateReadme(workflowFolder, folderName, plistObj, workflow);
    } catch (e) {
      console.error(e);
    }
  })
}

function main() {
  readAllWorkflows();
}

main();

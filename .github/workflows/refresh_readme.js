const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const plist = require('plist');

/**
 * github 缺省环境变量
 * https://docs.github.com/en/enterprise-cloud@latest/actions/learn-github-actions/environment-variables#default-environment-variables
 */
function updateReadme(items) {
  [path.resolve(__dirname, '../../', 'README.md'), path.resolve(__dirname, '../../', 'README-zh.md')].forEach((path) => {
    let readmeContent = fs.readFileSync(path, 'utf8');
    const workflowsList = items.map((item, index) => {
      return `\n${index + 1}. [${item.name}](https://github.com/alanhg/alfred-workflows${item.path})`;
    }).join('');
    const newReadmeContent = readmeContent.replace(/(?<=<!--workflow-start-->)[\s\S]*(?=<!--workflow-end-->)/, workflowsList)
    fs.writeFileSync(path, newReadmeContent);
  })
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
  const items = [];
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
      items.push({name: plistObj.name, path: `/tree/master/${folderName}`});
    } catch (e) {
      console.error(e);
    }
  });
  updateReadme(items);
}

function main() {
  readAllWorkflows();
}

main();

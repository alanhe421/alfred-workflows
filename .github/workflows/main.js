const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const plist = require('plist');
const [, , action] = process.argv;
const querystring = require('querystring');

/**
 * 输出workflow-name到固定文件，CI需要,之后走CI解析yaml，做到动态更新
 * @param items
 */
function writeWorkflowNameOptions(items) {
  fs.writeFileSync(path.join(__dirname, '../..', 'workflow_name_options.txt',), items.reduce((res, workflow) => res += `- ${workflow.name}\n`, ''), {
    encoding: 'utf8'
  });
}

/**
 * 更新仓库readme，包含中英文
 * github 缺省环境变量
 * https://docs.github.com/en/enterprise-cloud@latest/actions/learn-github-actions/environment-variables#default-environment-variables
 *
 * @param {{name,path}[]} items
 */
function updateHomeReadme(items) {
  [path.resolve(__dirname, '../../', 'README.md'),
    path.resolve(__dirname, '../../', 'README-zh.md')].forEach((path) => {
    let readmeContent = fs.readFileSync(path, 'utf8');
    const workflowsList = items.map((item, index) => {
      const arr = [];
      arr.push(`\n### ${index + 1}. [${item.name}](https://github.com/alanhg/alfred-workflows${(item.path)})`);
      arr.push(`${buildBadgeContent(item.plistObj, item.folderName, item.filename)}`);
      return arr.join('\n');
    }).join('\n');
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
  // 源码中node_modules不纳入版本管理
  execSync(`rm -rf ${workFlowUnzipFolder}/node_modules`);
  const plistObj = plist.parse(fs.readFileSync(`${workFlowUnzipFolder}/info.plist`, 'utf8'));
  return {plistObj};
}

function updateHomePage() {
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
      items.push({
        name: plistObj.name, path: `/tree/master/${folderName}`, folderName, plistObj,
        filename: querystring.escape(workflow)
      });
    } catch (e) {
      console.error(e);
    }
  });
  updateHomeReadme(items);
  writeWorkflowNameOptions(items);
}

function main() {
  if (action === 'updateHomePage') {
    updateHomePage();
  } else if (action === 'updatePerWorkflowPage') {
    updatePerWorkflowPage();
  }
}

main();


/**
 * github 缺省环境变量
 * https://docs.github.com/en/enterprise-cloud@latest/actions/learn-github-actions/environment-variables#default-environment-variables
 */
function updateReadme(absoluteWorkflowFolder, folderName, plistObj, workflow) {
  const readme = plistObj.readme;
  const readmeFile = absoluteWorkflowFolder + '/README.md';
  const filename = (path.basename(workflow));
  let readmeContent;
  try {
    if (!fs.existsSync(readmeFile)) {
      readmeContent = `

<!-- more -->`;
    } else {
      readmeContent = fs.readFileSync(readmeFile, 'utf8');
    }

    const badgeContent = `${readme}\n\n
${buildBadgeContent(plistObj, folderName, filename)}
\n\n`;
    readmeContent = readmeContent.replace(/(^(\s|\S)+)?(?=<!-- more -->)/, '');
    readmeContent = badgeContent + readmeContent;
    fs.writeFileSync(readmeFile, readmeContent);
  } catch (e) {
    console.log(e);
  }
}

function buildBadgeContent({version}, folderName, filename) {
  return `![](https://img.shields.io/badge/version-v${version}-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/${process.env.GITHUB_REPOSITORY}/raw/${process.env.GITHUB_REF_NAME}/${folderName}/${(filename)})
[![](https://img.shields.io/badge/plist-link-important?style=for-the-badge)](https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_REF_NAME}/${(folderName)}/src/info.plist)`
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
  // 源码中node_modules不纳入版本管理
  execSync(`rm -rf ${workFlowUnzipFolder}/node_modules`);
  const plistObj = plist.parse(fs.readFileSync(`${workFlowUnzipFolder}/info.plist`, 'utf8'));
  return {plistObj};
}

function updatePerWorkflowPage() {
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
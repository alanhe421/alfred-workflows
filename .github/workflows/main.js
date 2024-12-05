const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const plist = require('plist');
const Numbers = require('number-to-emoji');
const [, , action] = process.argv;
const querystring = require('querystring');
const {discussionCount} = process.env;

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
 * 更新readme中workflow部分介绍，包含中英文
 * github 缺省环境变量
 * https://docs.github.com/en/enterprise-cloud@latest/actions/learn-github-actions/environment-variables#default-environment-variables
 *
 * @param {{name,path}[]} items
 * @return {Promise<void>}
 */
async function updateHomeReadme(items) {
  const docs = ['README.md', 'README-zh.md'];
  for (let i = 0; i < docs.length; i++) {
    const filename = docs[i];
    const isEn = filename === 'README.md';
    const filePath = path.resolve(__dirname, '../../', filename);
    let readmeContent = fs.readFileSync(filePath, 'utf8');
    const map = [];

    for (let index = 0; index < items.length; index++) {
      const arr = [];
      const item = items[index];
      arr.push(`\n### ${index + 1}. [${item.name}](https://github.com/alanhg/alfred-workflows${(item.path)})`);
      item.plistObj.description && arr.push(`> ${item.plistObj.description}`);
      arr.push(`${await buildBadgeContent(item.plistObj, item.folderName, item.filename)}`);
      map.push(arr.join('\n'));
    }
    const workflowList = [isEn ? `There are ${Numbers.toEmoji(items.length)} workflows` : `共${Numbers.toEmoji(items.length)}个`,
      ...map];
    const workflowsListStr = workflowList.join('\n');

    console.log('discussionCount', discussionCount);


    console.log('readmeContent-before', readmeContent);
    const newReadmeContent = readmeContent
      .replace(/(?<=<!--workflow-start-->)[\s\S]*(?=<!--workflow-end-->)/, workflowsListStr)
      .replace(/(?<=<!--discussionCount-start-->)[\s\S]+(?=<!--discussionCount-end-->)/, `${Numbers.toEmoji(discussionCount)}`);
    console.log('readmeContent-after', newReadmeContent);
    fs.writeFileSync(filePath, newReadmeContent);
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
  // 源码中node_modules不纳入版本管理
  execSync(`rm -rf ${workFlowUnzipFolder}/node_modules`);
  const plistObj = plist.parse(fs.readFileSync(`${workFlowUnzipFolder}/info.plist`, 'utf8'));
  return {plistObj};
}

async function updateHomePage() {
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
  await updateHomeReadme(items);
  writeWorkflowNameOptions(items);
}

function main() {
  console.log('exec action:', action);
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
async function updateReadme(absoluteWorkflowFolder, folderName, plistObj, workflow) {
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
${await buildBadgeContent(plistObj, folderName, querystring.escape(filename))}
\n\n`;
    readmeContent = readmeContent.replace(/(^(\s|\S)+)?(?=<!-- more -->)/, '');
    readmeContent = badgeContent + readmeContent;
    fs.writeFileSync(readmeFile, readmeContent);
  } catch (e) {
    console.log(e);
  }
}

/**
 * 角标更新
 * 1. 版本号
 * 2. workflow下载地址
 * 3. plist地址
 * 4. install in Alfred
 */
async function buildBadgeContent({version}, folderName, filename) {
  let inGallery = false;
  try {
    const response = await fetch(`https://alfred.app/workflows/alanhe/${folderName}`);
    inGallery = response.ok;
  } catch (e) {
    console.log('response-error:', e, folderName);
  }
  return `
[![](https://img.shields.io/badge/version-v${version}-green?style=for-the-badge)](https://img.shields.io/badge/version-v${version}-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/${process.env.GITHUB_REPOSITORY}/raw/${process.env.GITHUB_REF_NAME}/${folderName}/${(filename)})
${inGallery ? `[![](https://img.shields.io/badge/Install%20In%20Alfred-8A2BE2?style=for-the-badge)](https://alfred.app/workflows/alanhe/${folderName}/install/)` : ''}
`
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

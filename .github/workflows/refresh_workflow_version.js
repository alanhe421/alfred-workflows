const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const plist = require('plist');
const querystring = require('querystring');

/**
 * 更新readme中version版本
 */
function updateVersion(workflowFolder, version, workflow) {
    const readmeFile = workflowFolder + '/README.md';
    const filename = querystring.escape(path.basename(workflow));
    try {
        let readmeContent = fs.readFileSync(readmeFile, 'utf8');
        if (!readmeContent.match(/shields/)) {
            readmeContent = `[![](https://img.shields.io/badge/version-v${version}-green)](./${filename})` + readmeContent;
        } else {
            readmeContent = readmeContent.replace(/(?<=version-v)(\d\.(\d\.)?\d)/, version);
        }
        fs.writeFileSync(readmeFile, readmeContent);
    } catch (e) {
        console.log(e);
    }
}

/**
 * 获取workflow文件中版本信息
 */
function getVersion(workflowFolder, workflow) {
    const workFlowFile = workflowFolder + '/' + workflow;
    const workFlowZipFile = workflowFolder + '/temp.zip';
    fs.copyFileSync(workFlowFile, workFlowZipFile);
    const workFlowUnzipFolder = workFlowZipFile.substring(0, workFlowZipFile.length - 4);
    execSync(`unzip -o ${workFlowZipFile} -d ${workFlowUnzipFolder}`);
    execSync(`rm -rf ${workFlowZipFile}`);
    const plistObj = plist.parse(fs.readFileSync(`${workFlowUnzipFolder}/info.plist`, 'utf8'));
    execSync(`mv ${workFlowUnzipFolder}/info.plist ${workflowFolder}/`);
    const version = plistObj.version;
    execSync(`rm -rf ${workFlowUnzipFolder}`);
    return version;
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
        const version = getVersion(workflowFolder, workflow);
        updateVersion(workflowFolder, version, workflow);
    })
}

function main() {
    readAllWorkflows();
}

main();

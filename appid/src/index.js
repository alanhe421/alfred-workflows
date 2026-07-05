/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const {Workflow, utils} = require('@stacker/alfred-utils');
const {execSync} = require('child_process');
const path = require('path');
const fs = require('fs');
const plist = require('plist');
const [, , action, query] = process.argv;
const wf = new Workflow();

(function () {
  if (action === 'av') {
    listAppVersions();
  } else if (action === 'appversion') {
    getAppVersion(query);
  } else if (action === 'appicon') {
    getAppIconPath(query);
  }
})();

function listAppVersions() {
  const apps = convertToApps(execSync('ls /Applications ', {encoding: 'utf-8'}), '/Applications').concat(convertToApps(execSync('ls /Applications/Utilities', {encoding: 'utf-8'}), '/Applications/Utilities'));
  for (let index = 0; index < apps.length; index++) {
    const version = readAppVersion(apps[index].path);
    const receipt = runCommand(`mdls -raw -name kMDItemAppStoreHasReceipt "${apps[index].path}"`);
    wf.addWorkflowItem({
      item: {
        title: apps[index].name, icon: {
          type: 'fileicon', path: apps[index].path
        }, subtitle: version + (receipt === '1' ? '（from App Store）' : ''), arg: version,
        action:{ file:apps[index].path}
      }
    });
  }
  wf.run();
}

function convertToApps(ouputstr, basePath) {
  return ouputstr
    .split('\n')
    .filter((item) => item.match(/\.app$/))
    .map((app) => ({
      name: app, path: path.join(basePath, app)
    }));
}

function getAppVersion(appPath) {
  const version = readAppVersion(appPath);
  utils.log(version);
}

function readAppVersion(appPath) {
  if (!appPath) {
    return '';
  }

  const mdlsVersion = runCommand(`mdls -raw -name kMDItemVersion "${appPath}"`);
  if (mdlsVersion && mdlsVersion !== '(null)') {
    return mdlsVersion;
  }

  const appInfo = plist.parse(fs.readFileSync(path.join(appPath, 'Contents/Info.plist'), 'utf8'));
  return appInfo.CFBundleShortVersionString || appInfo.CFBundleVersion || '';
}

function runCommand(command) {
  try {
    return execSync(command, {encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore']}).trim();
  } catch (error) {
    return '';
  }
}

function getAppIconPath(appPath) {
  let iconName = plist.parse(fs.readFileSync(path.join(appPath, 'Contents/Info.plist'), 'utf8')).CFBundleIconFile;
  if (path.extname(iconName) === '') {
    iconName += '.icns';
  }
  const iconPath = path.join(appPath, 'Contents/Resources', iconName);
  utils.log(iconPath);
}

/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const {Workflow, utils} = require('@stacker/alfred-utils');
const {execFileSync} = require('child_process');
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
  const apps = getApplicationDirs().flatMap(listAppsInDirectory)
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const app of apps) {
    const version = resolveAppVersion(app.path);
    const receipt = readMetadataValue(app.path, 'kMDItemAppStoreHasReceipt');
    wf.addWorkflowItem({
      item: {
        title: app.name, icon: {
          type: 'fileicon', path: app.path
        }, subtitle: version + (receipt === '1' ? '（from App Store）' : ''), arg: version,
        action:{ file:app.path}
      }
    });
  }
  wf.run();
}

function getAppVersion(appPath) {
  utils.log(resolveAppVersion(appPath));
}

function resolveAppVersion(appPath) {
  return readMetadataValue(appPath, 'kMDItemVersion')
    || readInfoPlistValue(appPath, 'CFBundleShortVersionString')
    || readInfoPlistValue(appPath, 'CFBundleVersion')
    || 'Unknown';
}

function readMetadataValue(appPath, key) {
  try {
    return normalizeValue(execFileSync('/usr/bin/mdls', ['-raw', '-name', key, appPath], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }));
  } catch (_) {
    return '';
  }
}

function readInfoPlistValue(appPath, key) {
  try {
    return normalizeValue(execFileSync('/usr/bin/plutil', [
      '-extract',
      key,
      'raw',
      '-o',
      '-',
      path.join(appPath, 'Contents/Info.plist')
    ], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }));
  } catch (_) {
    return '';
  }
}

function normalizeValue(value) {
  const normalized = String(value || '').trim();
  return normalized && normalized !== '(null)' && normalized !== 'null' ? normalized : '';
}

function getApplicationDirs() {
  return [
    '/Applications',
    '/Applications/Utilities',
    path.join(process.env.HOME, 'Applications'),
    path.join(process.env.HOME, 'Applications/JetBrains Toolbox')
  ].filter((directory) => fs.existsSync(directory) && fs.statSync(directory).isDirectory());
}

function listAppsInDirectory(basePath) {
  return fs.readdirSync(basePath, {withFileTypes: true})
    .filter((entry) => entry.name.endsWith('.app'))
    .map((entry) => ({
      name: entry.name, path: path.join(basePath, entry.name)
    }));
}

function getAppIconPath(appPath) {
  let iconName = plist.parse(fs.readFileSync(path.join(appPath, 'Contents/Info.plist'), 'utf8')).CFBundleIconFile;
  if (path.extname(iconName) === '') {
    iconName += '.icns';
  }
  const iconPath = path.join(appPath, 'Contents/Resources', iconName);
  utils.log(iconPath);
}

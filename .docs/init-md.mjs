import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rm } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import plist from "plist";
import fs from "fs";

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');

console.log('__dirname', __dirname);

const workflowDirs = readdirSync(path.join(__dirname), {withFileTypes: true})
  .filter(item => item.isDirectory() && item.name.match(/^(?!\.)/) && !item.name.includes('node_modules'));

console.log('workflowDirs', workflowDirs);

const workflowMetaInfos = workflowDirs.map(item => {
  const plistObj = plist.parse(fs.readFileSync(path.join(__dirname, `${item.name}/src/info.plist`), 'utf8'));
  return {
    name: item.name, title: plistObj.name, plistObj,
  };
});

function initWorkflows() {
  if (existsSync(path.join(__dirname, '.docs/workflows'))) {
    rm(path.join(__dirname, '.docs/workflows/'), () => {

    });
  } else {
    mkdirSync(path.join(__dirname, '.docs/workflows'));
  }
}

function createWorkflowDocs(dirs) {
  dirs.forEach(item => {
    if (!existsSync(path.join(__dirname, `.docs/workflows/${item.name}`))) {
      mkdirSync(path.join(__dirname, `.docs/workflows/${item.name}`));
    }
    copyFileSync(path.join(__dirname, `${item.name}/README.md`), path.join(__dirname, `.docs/workflows/${item.name}/${item.name}.md`));

    if (existsSync(path.join(__dirname, `${item.name}/screenshots`))) {
      cpSync(path.join(__dirname, `${item.name}/screenshots`), path.join(__dirname, `.docs/workflows/${item.name}/screenshots`), {recursive: true});
    }
  });
}

initWorkflows();
createWorkflowDocs(workflowDirs);

export { workflowDirs, workflowMetaInfos };

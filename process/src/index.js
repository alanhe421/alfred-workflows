/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils } = require('@stacker/alfred-utils');
const { execSync } = require('child_process');
const [, , query] = process.argv;

(function () {
  const res = execSync('lsof -PiTCP -sTCP:LISTEN', { encoding: 'utf-8' });
  const processArr = res.split('\n');
  processArr.pop();
  processArr.shift();
  const portMap = {}; // key为端口
  processArr.forEach((p) => {
    const port = p.match(/(\d+)(?= \(LISTEN\)$)/)[0];
    const command = p.match(/^(\S)+/)[0];
    const name = p.match(/(?<=TCP )(.+)$/)[0];
    const pid = p.match(/(?<=\s+)(\d+)(?=\s+)/)[0];
    if (!portMap[port]) {
      portMap[port] = {
        command,
        name,
        pid
      };
    }
  });
  const items = Object.keys(portMap).map((k) => {
    return utils.buildItem({
      title: portMap[k].command,
      subtitle: portMap[k].name,
      arg: portMap[k].pid,
      mods: {
        alt: {
          variables: {
            port: k
          }
        }
      }
    });
  });
  utils.printScriptFilter({
    items: utils.filterItemsBy(items, query, ['title', 'subtitle'])
  });
})();

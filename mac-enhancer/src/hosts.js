/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./hosts.js {query}
 */
const { utils } = require('@stacker/alfred-utils');
const fs = require('fs');
const [, ,] = process.argv;
(function () {
  utils.printScriptFilter({
    items: [
      utils.buildItem({
        title: '/etc/hosts',
        subtitle: ' ⇧ to view',
        quicklookurl: '/etc/hosts',
        arg: '/etc/hosts',
        text: {
          largetype: fs.readFileSync('/etc/hosts', { encoding: 'utf8' })
        }
      })
    ]
  });
})();

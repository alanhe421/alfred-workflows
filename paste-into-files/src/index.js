/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { input, utils } = require('@stacker/alfred-utils');
const clipboardy = require('clipboardy');
const fs = require('fs');
(function () {
  const data = clipboardy.readSync();
  console.log(123);
  console.log(data);

  fs.writeFileSync(input, data);
  utils.log(input);
})();

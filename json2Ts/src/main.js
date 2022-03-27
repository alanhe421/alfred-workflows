/**
 * usage
 * /usr/local/bin/node ./main.js {query}
 */
const [, , json] = process.argv;
const {json2ts} = require('json-ts');

(function () {
  try {
    let message = json2ts(json, {
      prefix: process.env.ts_prefix.trim(),
      rootName: process.env.ts_rootname.trim(),
      namespace: process.env.ts_namespace.trim(),
      flow: process.env.ts_prefer_interface.toLowerCase() !== 'true'
    });
    console.log(message);
  } catch (e) {
    process.stdout.write('1');
  }
})();


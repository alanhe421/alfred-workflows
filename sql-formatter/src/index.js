/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const [, ,query] = process.argv;
const { format } =require('sql-formatter');
(function () {
  console.log(format(query, { language: process.env.sql_dialect }));
})();

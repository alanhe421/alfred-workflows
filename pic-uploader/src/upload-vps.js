/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./upload-vps.js {query}
 */
const { utils, http } = require('@stacker/alfred-utils');
const [, , query] = process.argv;
const { execSync } = require('child_process');

(function () {
  const year = new Date().getFullYear();
  try {
    execSync(
      `ssh -p 22 ${process.env.vps_user}@${process.env.vps_server} "mkdir -p ${process.env.vps_destination}/${year}"`
    );
    execSync(
      `scp "${process.env.alfred_workflow_cache}/${query}" ${process.env.vps_user}@${process.env.vps_server}:${
        process.env.vps_destination
      }/${year}/`
    );
    console.log(`${process.env.vps_url}/${year}/${query}`);
  } catch (e) {
    console.log(e);
    console.log(1);
  }
})();

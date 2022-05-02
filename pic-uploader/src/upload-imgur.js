/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./upload-imgur.js {query}
 */
const { http, input, utils } = require('@stacker/alfred-utils');
const { readFileSync } = require('fs');

const [, ,] = process.argv;
const instance = http.createHttpClient();

(async function () {
  try {
    const {
      data: { access_token, refresh_token }
    } = await instance.post('https://api.imgur.com/oauth2/token', {
      refresh_token: process.env.imgur_refresh_token,
      client_id: process.env.imgur_client_id,
      client_secret: process.env.imgur_client_secret,
      grant_type: 'refresh_token'
    });
    utils.setVariable('imgur_refresh_token', refresh_token);
    utils.removeVariable('browser');
    const res = await instance.post(
      'https://api.imgur.com/3/image',
      {
        image: readFileSync(`${process.env.alfred_workflow_cache}/${input}`, {
          encoding: 'base64'
        }),
        type: 'base64'
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    if (res.data.success) {
      console.log(res.data.data.link);
      return;
    } else {
      process.stdout.write('1');
    }
  } catch (e) {
    console.error(e.response);
    process.stdout.write('1');
  }
})();

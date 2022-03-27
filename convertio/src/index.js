/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, http, input } = require('@stacker/alfred-utils');
const { readFileSync, writeFileSync } = require('fs');
const notifier = require('node-notifier');
const path = require('path');
const instance = http.createHttpClient('http://api.convertio.co');

const filename = path.basename(input);
(async function () {
  try {
    // Start a New Conversion
    const file = readFileSync(input, { encoding: 'base64' });
    const convertionId = await instance
      .post(
        '/convert',
        {
          apikey: process.env.api_key,
          input: 'base64',
          file,
          outputformat: 'epub',
          filename
        },
        {}
      )
      .then((res) => res.data.data.id);
    notifier.notify({
      title: process.env.alfred_workflow_name,
      message: 'Please wait for a moment while being converted',
      icon: path.join(__dirname, 'icon.png'),
    });
    // Get Status of the Conversion
    let step;
    while (step !== 'finish') {
      step = await instance
        .get(`/convert/${convertionId}/status`)
        .then((res) => res.data.data.step);
    }

    const fileContent = await instance
      .get(`/convert/${convertionId}/dl/base64`)
      .then((res) => res.data.data.content);
    const outputEpubFile =
      process.env.HOME + '/Downloads/' + path.parse(filename).name + '.epub';
    writeFileSync(outputEpubFile, fileContent, {
      encoding: 'base64'
    });
    console.log(outputEpubFile);
  } catch (error) {
    console.log(error);
  }
})();

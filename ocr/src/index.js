const fs = require('fs');
const path = require('path');
const {utils} = require('@stacker/alfred-utils');
const AipOcrClient = require('baidu-aip-sdk').ocr;

const [, , APP_ID, API_KEY, SECRET_KEY, LANGUAGE] = process.argv;

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

const picPath = path.join(process.env.alfred_workflow_cache, 'temp.png');

const imageAsBase64 = fs.readFileSync(picPath, 'base64');
const OpenCC = require('opencc');

const doOCR = new Promise((resolve, reject) => {
  client
    .generalBasic(imageAsBase64, { language_type: LANGUAGE })
    .then(function (result) {
      if (result.hasOwnProperty('error_code')) {
        reject('error_msg' + result['error_msg']);
      } else {
        resolve(result.words_result.map((item) => item.words).join('\n'));
      }
    })
    .catch(function (err) {
      reject('error_msg' + err);
    });
});

(async function () {
  try {
    let res = await doOCR;
    if (process.env.AUTO_OPEN_CC) {
      const converter = new OpenCC('t2s.json');
      res = await converter.convertPromise(res);
    }
    utils.log(res);
  } catch (e) {
    utils.log(e);
  } finally {
    fs.unlinkSync(picPath);
  }
})();

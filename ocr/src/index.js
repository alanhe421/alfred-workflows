const fs = require('fs');
const AipOcrClient = require('baidu-aip-sdk').ocr;

const [, , APP_ID, API_KEY, SECRET_KEY, LANGUAGE] = process.argv;

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

const picPath = __dirname + '/temp.png';

const imageAsBase64 = fs.readFileSync(picPath, 'base64');

client
  .generalBasic(imageAsBase64, { language_type: LANGUAGE })
  .then(function (result) {
    let out;
    if (result.hasOwnProperty('error_code')) {
      out = 'error_msg' + result['error_msg'];
    } else {
      out = result.words_result.map((item) => item.words).join('\n');
    }
    console.log(out);
  })
  .catch(function (err) {
    console.log(err);
  });

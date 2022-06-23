const zoom_regex = /(?<=https:\/\/)([\w.]+)\/j\/(\d+)\?pwd=([\w.-]+)/;
const tencent_meeting_num_regex = /\d{3,4}(-|\s)\d{3,4}\1\d{3,4}/;
const [, , query, app = 'tencent'] = process.argv;
const notifier = require('node-notifier');
const https = require('https');

(async function main() {
  let res;
  try {
    switch (app) {
      case 'tencent':
        res = await getTencentCode(query);
        if (res === '') {
          const linkFromWework = query.match(
            /https:\/\/work\.weixin\.qq\.com\/webapp\/tm\/[a-zA-Z0-9]+/
          );
          if (linkFromWework) {
            notifier.notify({
              title: process.env.alfred_workflow_name,
              message: `The Link ${linkFromWework[0]} not support`
            });
            return;
          }
        }
        break;
      case 'zoom':
        res = getZoomCode(query);
        break;
      default:
    }
    process.stdout.write(res);
  } catch (e) {
    process.stdout.write(-1);
  }
})();

async function getTencentCode(text) {
  const matches = text.match(tencent_meeting_num_regex);
  let code = matches ? matches[0] : '';
  if (!code) {
    code = await getTencentCodeFromLink(text);
  }
  code = code.replace(/(-|\s)/g, '');
  return code;
}

function getTencentCodeFromLink(text) {
  let match = text.match(/https:\/\/meeting.tencent.com\/dm\/\w+/);
  const link = match ? match[0] : null;
  if (link) {
    return new Promise((resolve) => {
      https.get(
        link,
        {
          headers: {
            'User-Agent': 'PostmanRuntime/7.28.3',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Language': 'zh,en;q=0.9,zh-CN;q=0.8'
          }
        },
        (res) => {
          let str = '';
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            str += chunk;
          });
          res.on('end', () => {
            resolve(str.match(tencent_meeting_num_regex)[0]);
          });
        }
      );
    });
  }
  return '';
}

function getZoomCode(text) {
  const url = text.match(zoom_regex)[0];
  res = url.replace(
    zoom_regex,
    (_, p1, p2, p3) => `
${p1}/join?action=join&confno=${p2}&pwd=${p3}`
  );
  return res;
}

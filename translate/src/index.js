const { MD5 } = require('./md5');
const axios = require('axios').default;
const clipboardy = require('clipboardy');

const [, , APP_ID, APP_KEY, query, from, to] = process.argv;
const q = query || clipboardy.readSync();
var salt = new Date().getTime();
var sign = MD5(APP_ID + query + salt + APP_KEY);

function goTranslate() {
  axios
    .get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
      params: {
        q,
        from: from,
        to: to,
        appid: APP_ID,
        salt: salt,
        sign: sign,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      const { trans_result, error_code } = res.data;
      if (error_code) {
        console.log(
          JSON.stringify({
            items: [
              {
                title: q,
                subtitle: 'error',
              },
            ],
          })
        );
      } else {
        const result = trans_result.map((item) => ({
          title: q,
          subtitle: item.dst,
          arg: item.dst,
          // icon: {
          //   // path: __dirname + '/icon.png',
          // },
        }));
        console.log(JSON.stringify({ items: result }));
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

setTimeout(() => {
  goTranslate();
}, 2000);

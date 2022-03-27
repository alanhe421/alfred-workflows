const [, , URL, query] = process.argv;
const querystring = require('querystring');
const {
  utils: {
    splitMultiArgStr
  },
  http
} = require('@stacker/alfred-utils');
const instance = http.createHttpClient(URL);
const [name, value] = splitMultiArgStr(query);

function getUrl() {
  if (name === 'allowMultipleChoice') {
    return '/cgi-bin/rules/allow-multiple-choice';
  }
  return '';
}

instance
  .post(
    getUrl(),
    querystring.stringify({
      [name]: Number(value === 'true')
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  .then(({data: {em}}) => {
    console.log(em);
  })
  .catch((e) => {
    console.log(e);
  });

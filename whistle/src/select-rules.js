const [, , URL, query] = process.argv;
const querystring = require('querystring');
const {
  utils: {
    splitMultiArgStr
  },
  http
} = require('@stacker/alfred-utils');
const instance = http.createHttpClient(URL);
const [name, value, selected] = splitMultiArgStr(query);
const { Base64 } = require('js-base64');

function getUrl() {
  if (name === 'default') {
    return selected === 'true'
      ? '/cgi-bin/rules/enable-default'
      : '/cgi-bin/rules/disable-default';
  }
  return selected === 'true'
    ? '/cgi-bin/rules/select'
    : '/cgi-bin/rules/unselect';
}

instance
  .post(
    getUrl(),
    querystring.stringify({
      name,
      value: Base64.decode(value)
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  .then(({ data: { em } }) => {
    console.log(em);
  })
  .catch((e) => {
    console.log(e);
  });

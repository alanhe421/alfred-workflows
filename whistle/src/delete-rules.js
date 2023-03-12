const [, , URL, query] = process.argv;
const querystring = require('qs');
const {
  utils: { splitMultiArgStr },
  http
} = require('@stacker/alfred-utils');
const instance = http.createHttpClient(URL);
const [name, value, selected] = splitMultiArgStr(query);

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
    querystring.stringify(
      {
        name,
        value
      },
      { format: 'RFC1738' }
    ),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  )
  .then(({ data: { em } }) => {
    console.log(em);
  })
  .catch((e) => {
    console.log(e);
  });

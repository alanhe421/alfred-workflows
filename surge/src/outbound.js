const [, , mode] = process.argv;
const [, , HTTP_API, query] = process.argv;
const instance = require('./axios').createHttpClient(HTTP_API);
instance
  .post('/v1/outbound', {
    mode: query
  })
  .then(() => {
    console.log('ok');
  });

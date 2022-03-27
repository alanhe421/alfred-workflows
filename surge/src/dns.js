const [, , mode] = process.argv;
const [, , HTTP_API, query] = process.argv;
const instance = require('./axios').createHttpClient(HTTP_API);

if (query === '/dns/flush') {
  instance.post('/v1/dns/flush').then(() => {
    console.log('ok');
  });
  return;
}
if (query === '/dns') {
  instance.get('/v1/dns').then((res) => {
    console.log(res.data);
  });
  return;
}
if (query === '/test/dns_delay') {
  instance.post('/v1/test/dns_delay').then((res) => {
    console.log(res.data);
  });
  return;
}

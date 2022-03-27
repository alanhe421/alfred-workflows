const [, , query] = process.argv;
const { utils } = require('@stacker/alfred-utils');

const instance = require('./axios').createHttpClient(process.env.HTTP_API);
instance.get('/v1/policy_groups').then((res) => {
  const items = Object.keys(res.data).map((item) => ({
    title: item,
    arg: item
  }));

  utils.outputScriptFilter({
    items: utils.filterItemsBy(items, query, 'title', 'subtitle')
  });
});

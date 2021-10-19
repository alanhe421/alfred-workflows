const [, , query] = process.argv;
const { utils } = require('@stacker/alfred-utils');

const instance = require('./axios').createHttpClient(process.env.HTTP_API);
const limit = 30;
instance.get('/v1/rules').then((res) => {
  const items = res.data.rules.map((item) => ({
    title: item.length > limit ? item.substring(0, limit - 3) + '...' : item,
    subtitle: item,
    arg: item,
    text: {
      copy: item,
      largetype: item
    }
  }));

  utils.outputScriptFilter({
    items: utils.filterItemsBy(items, query, 'title', 'subtitle')
  });
});

const [, , HTTP_API, query] = process.argv;
const { utils } = require('@stacker/alfred-utils');
const instance = require('./axios').createHttpClient(HTTP_API);
instance.get('/v1/modules').then((res) => {
  const items = res.data.available.map((item) => {
    const enabled = res.data.enabled.includes(item);
    return {
      title: item,
      subtitle: enabled ? 'enabled' : '',
      arg: utils.joinMultiArg('module', item, !enabled)
    };
  });
  utils.outputScriptFilter({
    items: utils.filterItemsBy(items, query, 'title')
  });
});

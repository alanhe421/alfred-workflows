const { utils } = require('@stacker/alfred-utils');
const { createHttpClient } = require('./axios');
const instance = createHttpClient(process.env.HTTP_API);
const query = process.env.module;
(async function main() {
  if (query === 'profiles') {
    const [name, profiles] = await Promise.all([
      instance.get('/v1/profiles/current').then((res) => res.data.name),
      instance.get('/v1/profiles').then((res) => res.data.profiles)
    ]);
    utils.printScriptFilter({
      items: profiles.map((item) => ({
        title: item,
        subtitle: item === name ? 'selected' : '',
        arg: utils.joinMultiArg(`switchProfile`, item),
        mods:{
          cmd:{
            arg:item
          }
        }
      }))
    });
    return;
  }
  if (query === 'log') {
    utils.printScriptFilter({
      items: [
        {
          level: 'warning',
          subtitle: ''
        },
        {
          level: 'notify',
          subtitle: ''
        },
        {
          level: 'info',
          subtitle: ''
        },
        {
          level: 'verbose',
          subtitle: 'not recommended to enable verbose in daily use'
        }
      ].map((item) => ({
        title: item.level,
        subtitle: item.subtitle,
        arg: utils.joinMultiArg('log', item.level)
      }))
    });
  }
})();

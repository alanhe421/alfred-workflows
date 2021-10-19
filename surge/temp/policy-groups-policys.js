const [, , group, query] = process.argv;
const { utils } = require('@stacker/alfred-utils');
const instance = require('./axios').createHttpClient(process.env.HTTP_API);

Promise.all([
  instance
    .get('/v1/policy_groups/select', {
      params: {
        group_name: group
      }
    })
    .then((res) => res.data),
  instance.get('/v1/policy_groups').then((res) => res.data[group])
]).then(([selectedPolicy, data]) => {
  const items = utils.filterItemsBy(
    data.map((item) => ({
      title: item.name,
      subtitle:
        item.typeDescription +
        `${selectedPolicy.policy === item.name ? utils.emoji.checked : ''}`,
      arg: utils.joinMultiArg('selectPolicyGroup', group, item.name)
    })),
    query,
    'title',
    'subtitle'
  );
  utils.outputScriptFilter({
    items
  });
});

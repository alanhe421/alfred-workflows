const doNotDisturb = require('@sindresorhus/do-not-disturb');

doNotDisturb.isEnabled().then((status) => {
  const res = {
    items: [
      {
        title: 'Do Not Disturb',
        subtitle: status ? 'enabled' : 'disabled',
        arg: String(!status)
      }
    ]
  };
  console.log(JSON.stringify(res));
});

const doNotDisturb = require('@sindresorhus/do-not-disturb');

doNotDisturb.toggle().then(() => {
  console.log(1);
});

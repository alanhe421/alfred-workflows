const { utils } = require('@stacker/alfred-utils');
const { checkUpdate } = require('@stacker/alfred-utils/dist/alfred-cli-check');
const [, , HTTP_API] = process.argv;
const instance = require('./axios').createHttpClient(HTTP_API);
const getSystemProxy = new Promise((resolve, reject) => {
  instance
    .get('/v1/features/system_proxy')
    .then((res) => {
      resolve({
        title: 'System Proxy',
        subtitle: res.data.enabled ? 'enabled' : 'disabled',
        arg: utils.joinMultiArg('systemproxy', !res.data.enabled)
      });
    })
    .catch((e) => reject(e));
});

const getEnhancedMode = new Promise((resolve) => {
  instance
    .get('/v1/features/enhanced_mode')
    .then((res) => {
      resolve({
        title: 'Enhanced Mode',
        subtitle: res.data.enabled ? 'enabled' : 'disabled',
        arg: utils.joinMultiArg(`enhancedmode`, !res.data.enabled)
      });
    })
    .catch((e) => reject(e));
});

const getMitmFeature = new Promise((resolve) => {
  instance.get('/v1/features/mitm').then((res) => {
    resolve({
      title: 'MitM',
      subtitle: res.data.enabled ? 'enabled' : 'disabled',
      arg: utils.joinMultiArg('mitm', !res.data.enabled)
    });
  });
});

const getCaptureFeature = new Promise((resolve) => {
  instance.get('/v1/features/capture').then((res) => {
    resolve({
      title: 'HTTP Capture',
      subtitle: res.data.enabled ? 'enabled' : 'disabled',
      arg: utils.joinMultiArg('capture', !res.data.enabled)
    });
  });
});

const getRewriteFeature = new Promise((resolve) => {
  instance
    .get('/v1/features/rewrite')
    .then((res) => {
      resolve({
        title: 'Rewrite',
        subtitle: res.data.enabled ? 'enabled' : 'disabled',
        arg: utils.joinMultiArg('rewrite', !res.data.enabled)
      });
    })
    .catch((e) => reject(e));
});

const getScriptingFeature = new Promise((resolve) => {
  instance
    .get('/v1/features/scripting')
    .then((res) => {
      resolve({
        title: 'Scripting',
        subtitle: res.data.enabled ? 'enabled' : 'disabled',
        arg: utils.joinMultiArg('scripting', !res.data.enabled)
      });
    })
    .catch((e) => reject(e));
});

const getOutboundMode = new Promise((resolve) => {
  instance
    .get('/v1/outbound')
    .then((res) => {
      resolve({
        title: 'Outbound Mode',
        subtitle: res.data.mode,
        arg: utils.joinMultiArg('outboundmode')
      });
    })
    .catch((e) => reject(e));
});

const getReloadProfile = new Promise((resolve) => {
  resolve({
    title: 'Reload Profile',
    subtitle: '',
    arg: 'reloadProfile'
  });
});

const getDNS = new Promise((resolve) => {
  resolve({
    title: 'DNS',
    subtitle: '',
    arg: 'dns'
  });
});

const getPolicyGroups = new Promise((resolve) => {
  resolve({
    title: 'Policy Groups',
    subtitle: '',
    arg: 'policyGroups'
  });
});

const getProfiles = new Promise((resolve) => {
  instance
    .get('/v1/profiles/current?sensitive=0')
    .then((res) => {
      resolve({
        title: 'Profiles',
        subtitle: `${res.data.name} ${utils.emoji.checked} , ⏎ to switch profile`,
        arg: 'profiles'
      });
    })
    .catch((e) => reject(e));
});

const getModules = new Promise((resolve) => {
  resolve({
    title: 'Module',
    subtitle: 'override the current profiles',
    arg: 'module'
  });
});

const getRules = new Promise((resolve) => {
  resolve({
    title: 'Rules',
    subtitle: 'Obtain the list of rules',
    arg: 'rules'
  });
});

const getLog = new Promise((resolve) => {
  resolve({
    title: 'Log',
    subtitle: 'Dynamically modify Log Level without writing to conf file',
    arg: 'log'
  });
});

const printItems = (obj) =>
  console.log(
    JSON.stringify({
      items: Array.isArray(obj) ? obj : [obj]
    })
  );

Promise.all([
  checkUpdate(),
  getSystemProxy,
  getEnhancedMode,
  getMitmFeature,
  getCaptureFeature,
  getRewriteFeature,
  getScriptingFeature,
  getOutboundMode,
  getReloadProfile,
  getDNS,
  getProfiles,
  getPolicyGroups,
  getModules,
  getRules,
  getLog
])
  .then(([updateItem, ...res]) => {
    if (updateItem) {
      res.unshift(updateItem);
    }
    utils.outputScriptFilter({
      items: res
    });
  })
  .catch((e) => {
    printItems({
      title: 'You should enable HTTP API',
      subtitle: 'Press enter to config',
      arg: 'httpApi'
    });
  });
module.exports = {
  axios: instance
};

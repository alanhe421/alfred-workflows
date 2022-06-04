const {utils, Workflow} = require('@stacker/alfred-utils');
const {checkUpdate} = require('@stacker/alfred-utils/dist/alfred-cli-check');
const {createHttpClient} = require('./axios');
const instance = createHttpClient(process.env.HTTP_API);
const workflow = new Workflow([], true);

const getSystemProxy = new Promise((resolve, reject) => {
  instance
      .get('/v1/features/system_proxy')
      .then((res) => {
        workflow.addWorkflowItem({
          item: {
            title: 'system Proxy',
            subtitle: res.data.enabled ? 'enabled' : 'disabled',
            arg: utils.joinMultiArg('systemproxy', !res.data.enabled)
          }
        });
        resolve();
      })
      .catch((e) => reject(e));
});

const getEnhancedMode = new Promise((resolve, reject) => {
  instance
      .get('/v1/features/enhanced_mode')
      .then((res) => {
        workflow.addWorkflowItem({
          item: {
            title: 'Enhanced Mode',
            subtitle: res.data.enabled ? 'enabled' : 'disabled',
            arg: utils.joinMultiArg(`enhancedmode`, !res.data.enabled)
          }
        });
        resolve();
      })
      .catch((e) => reject(e));
});

const getMitmFeature = new Promise((resolve) => {
  instance.get('/v1/features/mitm').then((res) => {
    workflow.addWorkflowItem({
      item: {
        title: 'MitM',
        subtitle: res.data.enabled ? 'enabled' : 'disabled',
        arg: utils.joinMultiArg('mitm', !res.data.enabled)
      }
    });
    resolve();
  });
});

const getCaptureFeature = new Promise((resolve) => {
  instance.get('/v1/features/capture').then((res) => {
    workflow.addWorkflowItem({
      item: {
        title: 'HTTP Capture',
        subtitle: res.data.enabled ? 'enabled' : 'disabled',
        arg: utils.joinMultiArg('capture', !res.data.enabled)
      }
    });
    resolve();
  });
});

const getRewriteFeature = new Promise((resolve) => {
  instance
      .get('/v1/features/rewrite')
      .then((res) => {
        workflow.addWorkflowItem({
          item: {
            title: 'Rewrite',
            subtitle: res.data.enabled ? 'enabled' : 'disabled',
            arg: utils.joinMultiArg('rewrite', !res.data.enabled)
          }
        });
        resolve();
      })
      .catch((e) => reject(e));
});

const getScriptingFeature = new Promise((resolve) => {
  instance
      .get('/v1/features/scripting')
      .then((res) => {
        workflow.addWorkflowItem({
          item: {
            title: 'Scripting',
            subtitle: res.data.enabled ? 'enabled' : 'disabled',
            arg: utils.joinMultiArg('scripting', !res.data.enabled)
          }
        });
        resolve();
      })
      .catch((e) => reject(e));
});

const getOutboundMode = new Promise((resolve) => {
  instance
      .get('/v1/outbound')
      .then((res) => {
        workflow.addWorkflowItem({
          item: {
            title: 'Outbound Mode',
            subtitle: res.data.mode,
            arg: utils.joinMultiArg('outboundmode')
          }
        });
        resolve();
      })
      .catch((e) => reject(e));
});

const getReloadProfile = new Promise((resolve) => {
  workflow.addWorkflowItem({
    item: {
      title: 'Reload Profile',
      subtitle: '',
      arg: 'reloadProfile'
    }
  });
  resolve();
});

const getDNS = new Promise((resolve) => {
  workflow.addWorkflowItem({
    item: {
      title: 'DNS',
      subtitle: '',
      arg: 'dns'
    }
  });
  resolve();
});

const getPolicyGroups = new Promise((resolve) => {
  workflow.addWorkflowItem({
    item: {
      title: 'Policy Groups',
      subtitle: '',
      arg: 'policyGroups'
    }
  });
  resolve();
});

const getProfiles = new Promise((resolve) => {
  instance
      .get('/v1/profiles/current?sensitive=0')
      .then((res) => {
        workflow.addWorkflowItem({
          item: {
            title: 'Profiles',
            subtitle: `${res.data.name} ${utils.emoji.checked} , ⏎ to switch profile`,
            arg: 'profiles'
          }
        });
        resolve();
      })
      .catch((e) => reject(e));
});

const getModules = new Promise((resolve) => {
  workflow.addWorkflowItem({
    item: {
      title: 'Module',
      subtitle: 'override the current profiles',
      arg: 'module'
    }
  });
  resolve();
});

const getRules = new Promise((resolve) => {
  workflow.addWorkflowItem({
    item: {
      title: 'Rules',
      subtitle: 'Obtain the list of rules',
      arg: 'rules'
    }
  });
  resolve();
});

const getLog = new Promise((resolve) => {
  workflow.addWorkflowItem({
    item: {
      title: 'Log',
      subtitle: 'Dynamically modify Log Level without writing to conf file',
      arg: 'log'
    }
  });
  resolve();
});

const printItems = (obj) =>
    console.log(
        JSON.stringify({
          items: Array.isArray(obj) ? obj : [obj]
        })
    );
workflow.runWithCacheData({rerun: 0.5}, 'script_filter').then(() => {
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
      .then(([updateItem]) => {
        if (updateItem) {
          workflow.addWorkflowItem({
            score: 9999,
            item: updateItem
          });
        }
        workflow.writeCacheData(10 * 60 * 1000, 'script_filter'); // 10m
      })
      .catch((e) => {
        printItems({
          title: 'You should enable HTTP API',
          subtitle: 'Press enter to config',
          arg: 'httpApi'
        });
      });
});

module.exports = {
  axios: instance
};

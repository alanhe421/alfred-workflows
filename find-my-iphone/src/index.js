const { http, utils, dateUtils } = require('@stacker/alfred-utils');
const { execSync } = require('child_process');

const client = http.createHttpClient(
  'https://p102-fmipweb.icloud.com/fmipservice/client/web'
);
const [, , type, query] = process.argv;
client.headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  Origin: 'https://www.icloud.com',
  Referer: 'https://www.icloud.com/'
};

let retryCount = 1;

async function fetchDeviceList(query) {
  try {
    const res = await client.post(
      '/refreshClient',
      {
        serverContext: {
          minCallbackIntervalInMS: 5000,
          enable2FAFamilyActions: false,
          preferredLanguage: 'zh-cn',
          lastSessionExtensionTime: null,
          enableMapStats: true,
          callbackIntervalInMS: 20000,
          validRegion: true,
          timezone: {
            currentOffset: 28800000,
            previousTransition: 684860399999,
            previousOffset: 32400000,
            tzCurrentName: 'China Standard Time',
            tzName: process.env.timezone
          },
          authToken: null,
          maxCallbackIntervalInMS: 15000,
          classicUser: false,
          isHSA: true,
          trackInfoCacheDurationInSecs: 86400,
          imageBaseUrl: 'https://statici.icloud.com',
          minTrackLocThresholdInMts: 100,
          itemLearnMoreURL:
            'https://support.apple.com/kb/HT211331?viewlocale=en',
          maxLocatingTime: 90000,
          itemsTabEnabled: true,
          sessionLifespan: 900000,
          info: 's6e8SkKZIZVjOtrweGcWgLwYwazy56D/KPMPMsjq7vkTqo78e2Yww6Xh8JF1tkQS',
          prefsUpdateTime: 1623071252964,
          useAuthWidget: true,
          clientId: process.env.clientId,
          inaccuracyRadiusThreshold: 200,
          enable2FAFamilyRemove: false,
          serverTimestamp: 1634959116078,
          deviceImageVersion: '14',
          macCount: 0,
          deviceLoadStatus: '200',
          maxDeviceLoadTime: 60000,
          prsId: 1219227461,
          showSllNow: false,
          cloudUser: true,
          enable2FAErase: false,
          id: 'server_ctx'
        },
        clientContext: {
          appName: 'iCloud Find (Web)',
          appVersion: '2.0',
          timezone: process.env.timezone,
          inactiveTime: 169753,
          apiVersion: '3.0',
          deviceListVersion: 1,
          fmly: true
        }
      },
      {
        headers: {
          ...client.headers,
          Cookie: process.env.cookie
        },
        params: {
          clientBuildNumber: process.env.clientBuildNumber,
          clientId: process.env.clientId,
          clientMasteringNumber: process.env.clientBuildNumber,
          dsid: process.env.dsid
        }
      }
    );
    const items = res.data.content.map((item) =>
      utils.buildItem({
        title: item.name,
        subtitle: `${
          item.deviceStatus === '200' ? '🟢' : '⚪'
        } ${dateUtils.formatToCalendar(item.location.timeStamp)}`,
        arg: item.id,
        icon: {
          path: `./icons/${item.rawDeviceModel}.png`
        }
      })
    );

    utils.outputScriptFilter({
      items: utils.filterItemsBy(items, query, 'title')
    });
  } catch (e) {
    throw e;
  }
}

async function playSound(id) {
  try {
    await client.post(
      '/playSound',
      {
        device: id,
        serverContext: {
          minCallbackIntervalInMS: 5000,
          enable2FAFamilyActions: false,
          preferredLanguage: 'zh-cn',
          lastSessionExtensionTime: null,
          enableMapStats: true,
          callbackIntervalInMS: 20000,
          validRegion: true,
          timezone: {
            currentOffset: 28800000,
            previousTransition: 684860399999,
            previousOffset: 32400000,
            tzCurrentName: 'China Standard Time',
            tzName: process.env.timezone
          },
          authToken: null,
          maxCallbackIntervalInMS: 15000,
          classicUser: false,
          isHSA: true,
          trackInfoCacheDurationInSecs: 86400,
          imageBaseUrl: 'https://statici.icloud.com',
          minTrackLocThresholdInMts: 100,
          itemLearnMoreURL:
            'https://support.apple.com/kb/HT211331?viewlocale=en',
          maxLocatingTime: 90000,
          itemsTabEnabled: true,
          sessionLifespan: 900000,
          info: 's6e8SkKZIZVjOtrweGcWgLwYwazy56D/KPMPMsjq7vkTqo78e2Yww6Xh8JF1tkQS',
          prefsUpdateTime: 1623071252964,
          useAuthWidget: true,
          clientId: process.env.clientId,
          inaccuracyRadiusThreshold: 200,
          enable2FAFamilyRemove: false,
          serverTimestamp: 1634959116078,
          deviceImageVersion: '14',
          macCount: 0,
          deviceLoadStatus: '200',
          maxDeviceLoadTime: 60000,
          prsId: 1219227461,
          showSllNow: false,
          cloudUser: true,
          enable2FAErase: false,
          id: 'server_ctx'
        },
        clientContext: {
          appName: 'iCloud Find (Web)',
          appVersion: '2.0',
          timezone: process.env.timezone,
          inactiveTime: 169753,
          apiVersion: '3.0',
          deviceListVersion: 1,
          fmly: true
        },
        subject: 'Alfred-find-my Alert'
      },
      {
        headers: {
          ...client.headers,
          Cookie: process.env.cookie
        },
        params: {
          clientBuildNumber: process.env.clientBuildNumber,
          clientMasteringNumber: process.env.clientBuildNumber,
          clientId: process.env.clientId,
          dsid: process.env.dsid
        }
      }
    );
    console.log('ok');
  } catch (e) {
    throw e;
  }
}

async function login() {
  try {
    const res = await client.post(
      'https://setup.icloud.com/setup/ws/1/accountLogin',
      {
        appName: 'find',
        apple_id: process.env.apple_id,
        password: process.env.password
      },
      {
        params: {
          clientBuildNumber: process.env.clientBuildNumber,
          clientMasteringNumber: process.env.clientBuildNumber,
          clientId: process.env.clientId,
          dsid: process.env.dsid
        },
        headers: {
          ...client.headers,
          Cookie: process.env.cookie
        }
      }
    );
    execSync(
      `osascript -e 'tell application id "com.runningwithcrayons.Alfred" to set configuration "cookie" to value "${res.headers[
        'set-cookie'
      ].join(';').replace(/"/g,'\\"')}" in workflow "${process.env.alfred_workflow_bundleid}"'`
    );
  } catch (e) {
    throw e;
  }
}

(async function main() {
  try {
    if (type === 'list') {
      await fetchDeviceList(query);
    } else if (type === 'playsound') {
      await playSound(query);
    }
  } catch (e) {
    if (retryCount > 0) {
      retryCount--;
      await login();
      main();
    } else {
      utils.outputScriptFilter({
        items: [
          utils.buildItem({
            title: 'You should login iCloud Web for first use',
            subtitle:
              'copy some value to Alfred Workflow Environment Varisables'
          })
        ]
      });
    }
  }
})();

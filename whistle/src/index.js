const {
  utils: {
    filterItemsBy,
    quickLookUrl4File,
    printScriptFilter,
    joinMultiArg,
    emoji,
    buildItem
  },
  http,
  utils
} = require('@stacker/alfred-utils');
const [, , URL, ROOT_PATH, query] = process.argv;
const instance = http.createHttpClient(URL);
const fs = require('fs');
const querystring = require('querystring');
const settingItem = buildItem({
  title: 'Settings',
  subtitle: 'Custom Setting', // 为避免与某个rule规则重名
  arg: '_settings',
  icon: {
    path: 'icons/settings.png'
  },
  variables: {},
  uid: 'settings'
});

const networkItem = buildItem({
  title: 'Network',
  subtitle:
    'View the request response details and timeline of the request list',
  arg: 'network',
  icon: {
    path: 'icons/earth.png'
  },
  variables: {
    path: 'network'
  },
  uid: 'network'
});

const stopItem = buildItem({
  title: 'Stop',
  subtitle: 'Stop Whistle service',
  arg: '_stop',
  icon: {
    path: 'icons/stop.png'
  },
  variables: {
    path: 'stop'
  }
});

const restartItem = buildItem({
  title: 'Restart',
  subtitle: 'Restart Whistle service',
  arg: '_restart',
  icon: {
    path: 'icons/stop.png'
  },
  variables: {
    path: 'restart'
  }
});

const globalProxyItem = buildItem({
  title: 'Set as Global Proxy',
  subtitle: 'Enter will change OS Web Proxy to this',
  arg: '_global_proxy',
  icon: {
    path: 'icons/http-proxy.png'
  }
});

// http://127.0.0.1:8899
function extractPortAndHost(url = '') {
  const port = url.split(':')[2];
  const host = url.split(':')[1].replace('//', '');
  return { port, host };
}

async function main() {
  try {
    const data = await instance.get('/cgi-bin/init').then((res) => {
      return Promise.resolve(res.data);
    });
    const items = createFilterItems(data);
    const params = 'selected'.match(new RegExp('^' + query.trim()))
      ? ['title', 'subtitle']
      : ['title'];

    const { port, host } = extractPortAndHost(URL);

    printScriptFilter({
      items: filterItemsBy(
        items,
        query,
        params,
        utils.buildItem({
          title: 'No matched rules',
          subtitle: '⏎ to Visit dashboard',
          arg: 'no_matched_rules',
          variables: {
            path: 'rules'
          }
        })
      ),
      variables: {
        keyword: query,
        host,
        port
      }
    });
  } catch (e) {
    printScriptFilter({
      items: [
        {
          title: 'Service unavailable!',
          subtitle: typeof e === 'string' ? e : e.message,
          arg: 'service_unavailable'
        }
      ]
    });
  }
}

function createFilterItems(data) {
  const items = data.rules.list.map(formatItem);
  const defaultItem = formatItem({
    name: 'default',
    selected: !data.rules.defaultRulesIsDisabled,
    data: data.rules.defaultRules || ''
  });
  items.unshift(settingItem, networkItem, defaultItem);
  items.push(stopItem, restartItem, globalProxyItem);
  return items;
}

function formatItem(item) {
  const filename = `${ROOT_PATH}/${querystring.escape(item.name)}.txt`;
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  fs.appendFile(filename, item.data, (e) => {
    if (e) {
      console.log(e);
    }
  });
  return buildItem({
    title: item.name,
    subtitle: item.selected ? 'selected' : '',
    arg: joinMultiArg(item.name, item.data, !item.selected),
    text: {
      copy: item.data,
      largetype: item.data
    },
    variables: {
      ruleContent: item.data,
      ruleName: item.name,
      path: 'rules',
      notification:
        '[' +
        item.name +
        '] ' +
        (!item.selected ? emoji.checked : emoji.unchecked)
    },
    quicklookurl: quickLookUrl4File(filename),
    uid: item.name
  });
}

main();

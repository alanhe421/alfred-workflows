/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, Workflow } = require('@stacker/alfred-utils');
const { getCurProxy } = require('./network-utils');
const { exec } = require('child_process');
const [, ,] = process.argv;
const wf = new Workflow();
(function () {
  const { http, https, socks } = getCurProxy();

  wf.addWorkflowItem({
    item: {
      uid: 'http proxy',
      title: 'HTTP Proxy',
      subtitle: buildHttpProxySubtitle(http),
      icon: {
        path: 'icon/http.png'
      },
      text: {
        copy: http.enabled ? `${http.host}:${http.port}` : '',
        largetype: http.enabled ? `${http.host}:${http.port}` : ''
      },
      arg: http.enabled ? `${http.host}:${http.port}` : ''
    }
  });

  wf.addWorkflowItem({
    item: {
      uid: 'https proxy',
      title: 'HTTPS Proxy',
      subtitle: buildHttpProxySubtitle(https),
      icon: {
        path: 'icon/https.png'
      },
      text: {
        copy: https.enabled ? `${https.host}:${https.port}` : '',
        largetype: https.enabled ? `${https.host}:${https.port}` : ''
      },
      arg: https.enabled ? `${https.host}:${https.port}` : ''
    }
  });
  wf.addWorkflowItem({
    item: {
      uid: 'socks proxy',
      title: 'SOCKS Proxy',
      subtitle: buildHttpProxySubtitle(socks),
      icon: {
        path: 'icon/socks.png'
      },
      text: {
        copy: socks.enabled ? `${socks.host}:${socks.port}` : '',
        largetype: socks.enabled ? `${socks.host}:${socks.port}` : ''
      },
      arg: socks.enabled ? `${socks.host}:${socks.port}` : ''
    }
  });
  exec('curl ifconfig.me', { encoding: 'utf8', timeout: 1000 }, (error, stdout) => {
    if (!error) {
      wf.addWorkflowItem({
        item: {
          uid: 'public ip address',
          title: 'Public IP Address',
          subtitle: stdout,
          icon: {
            path: 'icon/public-ip.png'
          },
          text: {
            copy: stdout,
            largetype: stdout
          },
          arg: stdout
        }
      });
    }
    wf.run({
    });
  });
})();

function buildHttpProxySubtitle(http) {
  return `${!(http.host || +http.port)
      ? 'proxy not enabled'
      : `${http.host}:${http.port}`
    } ${http.enabled ? utils.emoji.greenChecked : utils.emoji.greenUnChecked
    }`;
}

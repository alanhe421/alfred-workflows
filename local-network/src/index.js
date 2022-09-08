/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, Workflow } = require('@stacker/alfred-utils');
const { getCurProxy } = require('./network-utils');
const [, ,] = process.argv;
const wf = new Workflow();
(function () {
  const { http, https } = getCurProxy();

  wf.addWorkflowItem({
    item: {
      title: 'HTTP Proxy',
      subtitle: buildHttpProxySubtitle(http),
      icon: {
        path: 'icon/http.png'
      },
      text: {
        copy: http.enabled ? `${http.host}:${http.port}` : '',
        largetype: http.enabled ? `${http.host}:${http.port}` : ''
      }
    }
  });

  wf.addWorkflowItem({
    item: {
      title: 'HTTPS Proxy',
      subtitle: buildHttpProxySubtitle(https),
      icon: {
        path: 'icon/https.png'
      },
      text: {
        copy: https.enabled ? `${https.host}:${https.port}` : '',
        largetype: https.enabled ? `${https.host}:${https.port}` : ''
      }
    }
  });
  wf.run();
})();

function buildHttpProxySubtitle(http) {
  return `${
    http.enabled ? utils.emoji.greenChecked : utils.emoji.greenUnChecked
  }${!(http.host || +http.port) ? 'proxy not enabled' : `${http.host}:${http.port}`}`;
}

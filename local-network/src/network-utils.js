const execSync = require('child_process').execSync;
const join = require('path').join;
const fs = require('fs');

function getProxyServer(protocol = 'http') {
  let command = protocol === 'socks' ? 'networksetup -getsocksfirewallproxy Wi-Fi' : 'networksetup -get' + (protocol === 'https' ? 'secure' : '') + 'webproxy "Wi-Fi"';
  const str = execSync(command) + '';
  const result = {};
  str.split(/[\r\n]+/).forEach(function (line) {
    const index = line.indexOf(':');
    const key = line.substring(0, index).trim().toLowerCase();
    const value = line.substring(index + 1).trim().toLowerCase();
    if (key === 'enabled') {
      result.enabled = value === 'yes';
    } else if (key === 'server') {
      result.host = value;
    } else if (key === 'port') {
      result.port = value;
    }
  });
  return result;
}

function getCurProxy() {
  return {
    http: getProxyServer(),
    https: getProxyServer('https'),
    socks: getProxyServer('socks')
  };
}

function checkProxy(p1, p2) {
  if (!p1.enabled) {
    return false;
  }
  return p1.host == p2.host && p1.port == p2.port;
}

module.exports.getCurProxy = getCurProxy

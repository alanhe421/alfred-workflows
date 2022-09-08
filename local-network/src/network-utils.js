var execSync = require('child_process').execSync;
var join = require('path').join;
var fs = require('fs');

function getProxyServer(isSecure) {
  var str = execSync('networksetup -get' + (isSecure ? 'secure' : '') + 'webproxy "Wi-Fi"') + '';
  var result = {};
  str.split(/[\r\n]+/).forEach(function (line) {
    var index = line.indexOf(':');
    var key = line.substring(0, index).trim().toLowerCase();
    var value = line.substring(index + 1).trim().toLowerCase();
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
    https: getProxyServer(true)
  };
}

function checkProxy(p1, p2) {
  if (!p1.enabled) {
    return false;
  }
  return p1.host == p2.host && p1.port == p2.port;
}

module.exports.getCurProxy = getCurProxy

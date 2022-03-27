const { utils, http } = require('@stacker/alfred-utils');
const fs = require('fs');
const { execSync } = require('child_process');
const { existsSync, createWriteStream } = require('fs');
const dbPath = `${__dirname}/Country.mmdb`;
const { Reader } = require('maxmind');
const moment = require('moment');
let [, , query] = process.argv;
const ipUtils = require('ip');
const instance = http.createHttpClient();

(async function () {
  if (!query) {
    utils.outputScriptFilter({
      items: [getLocalIp(), getPublicIp()]
    });
    return;
  }
  query = query.trim();
  try {
    if (
      !existsSync(dbPath) ||
      moment(new Date()).diff(moment(fs.statSync(dbPath).mtime)) >
        process.env.cache_lifetime
    ) {
      const response = await instance.get(process.env.mmdp_url, {
        responseType: 'stream'
      });
      response.data.pipe(createWriteStream(dbPath));
      await delay(1000);
    }
    const items = [];
    if (isIpAddress(query)) {
      items.push(buildIpItem(query));
    } else {
      items.push(buildIpItem(getIpByDomain(query)));
    }
    utils.outputScriptFilter({
      items
    });
  } catch (err) {
    console.error(err);
  }
})();

function getLocalIp() {
  return utils.buildItem({
    title: ipUtils.address(),
    subtitle: 'local ip address',
    arg: ipUtils.address(),
    icon: {
      path: 'icon/ip.png'
    }
  });
}

function getPublicIp() {
  const res = execSync('curl cip.cc -s', { encoding: 'utf8' });
  const ip = res.match(/(?<=IP\s+:\s)(.+)/)[0];
  const location = res.match(/(?<=数据二\s+:\s)(.+)/)[0];
  return utils.buildItem({
    title: ip,
    subtitle: 'public network server IP / ' + location,
    arg: ip
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function isIpAddress(ip) {
  return ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
}

function buildIpItem(ip) {
  const buffer = fs.readFileSync(dbPath);
  const lookup = new Reader(buffer);
  const result = lookup.get(ip);
  if (result) {
    return utils.buildItem({
      title: `${ip} 🇨🇳`,
      subtitle: result.country.iso_code,
      icon: {
        path: 'icon/cn.png'
      },
      arg: ip
    });
  } else {
    return utils.buildItem({
      title: `${ip}`,
      subtitle: '非中国',
      icon: {
        path: 'icon/earth.png'
      },
      arg: ip
    });
  }
}

function getIpByDomain(domain) {
  const res = execSync(`nslookup ${domain}`, { encoding: 'utf8' });
  const ip = res.match(/(?<=Address:).+/g)[1];
  return ip;
}

const zoom_regex = /(?<=https:\/\/)([\w.]+)\/j\/(\d+)\?pwd=([\w.-]+)/;
const [, , query, app] = process.argv;
let res;
switch (app) {
  case 'tencent':
    res = query.match(/\d{3}-\d{3}-\d{3}/)[0];
    break;
  case 'zoom':
    const url = query.match(zoom_regex)[0];
    res = url.replace(
      zoom_regex,
      (_, p1, p2, p3) => `
${p1}/join?action=join&confno=${p2}&pwd=${p3}`
    );
    break;
  default:
}

process.stdout.write(res);

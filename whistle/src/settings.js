const [, , URL] = process.argv;
const {
  utils: { printScriptFilter, joinMultiArg, emoji },
  http
} = require('@stacker/alfred-utils');
const instance = http.createHttpClient(URL);

async function main() {
  try {
    const [data, { data: versionRes }] = await Promise.all([
      instance.get('/cgi-bin/get-data').then((res) => {
        return Promise.resolve(res.data);
      }),
      instance.get('/cgi-bin/check-update')
    ]);
    printScriptFilter({
      items: [
        {
          title: 'Use multiple rules',
          subtitle: data.allowMultipleChoice ? 'selected' : '',
          arg: joinMultiArg('allowMultipleChoice', !data.allowMultipleChoice),
          variables: {
            notification:
              '[' +
              'allowMultipleChoice' +
              '] ' +
              (!data.allowMultipleChoice ? emoji.checked : emoji.unchecked)
          }
        },
        {
          title: versionRes.showUpdate
            ? `Latest Version:${versionRes.latestVersion}`
            : 'Up to date',
          subtitle: `Version:${versionRes.version}`,
          arg: 'installNewVersion',
          text: {
            copy: `v${versionRes.version}`,
            largetype: `v${versionRes.version}`
          }
        }
      ]
    });
  } catch (e) {
    printScriptFilter({
      items: [
        {
          title: 'service unavalable!',
          subtitle: 'service not start or port wrong'
        }
      ]
    });
  }
}

main();

const {http, utils} = require('@stacker/alfred-utils');
const [, , query] = process.argv;
const client = http.createHttpClient('https://ofcncog2cu-2.algolianet.com');

function fetchList() {
  return client.post(
    '/1/indexes/*/queries?x-algolia-agent=TS+DT+Fetch&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e',
    {
      requests: [
        {
          analyticsTags: ['typescriptlang.org/dt/search'],
          attributesToHighlight: ['name', 'description', 'keywords'],
          attributesToRetrieve: [
            'deprecated',
            'description',
            'downloadsLast30Days',
            'homepage',
            'humanDownloadsLast30Days',
            'keywords',
            'license',
            'modified',
            'name',
            'owner',
            'repository',
            'types',
            'version'
          ],
          facets: ['keywords', 'keywords', 'owner.name'],
          hitsPerPage: 51,
          indexName: 'npm-search',
          maxValuesPerFacet: 10,
          page: 0,
          params: '',
          query: query,
          tagFilters: ''
        }
      ]
    }
  );
}

fetchList().then((res) => {
  const items = res.data.results[0].hits
    .filter((item) => Boolean(item.types.ts))
    .map((item) => {
      return {
        title: item.name,
        subtitle: [
          item.types.ts,
          item.types.definitelyTyped || '',
          'DLS:' + item.humanDownloadsLast30Days
        ].join(', '),
        icon: {
          path: './dt.png'
        },
        text: {
          copy: item.name,
          largetype: item.description
        },
        arg:
          item.types.ts === 'definitely-typed'
            ? `npm install ${item.types.definitelyTyped}`
            : `npm install ${item.name}`,
        mods: {
          alt: {
            valid: true,
            arg: item.repository.url
          }
        }
      };
    });

  utils.outputScriptFilter({
    items
  });
});

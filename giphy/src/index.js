const [, , HTTP_API, query, limit, channel] = process.argv;
const instance = require('./axios').createHttpClient();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const searchGif = () =>
  instance
    .get(`/v1/${channel}/search`, {
      params: {
        api_key: HTTP_API,
        q: query,
        limit,
        offset: 0,
        rating: 'g',
        lang: 'en'
      }
    })
    .then(({ data: res }) => {
      const items = [];
      const downloadPreviewGifs = [];
      res.data.forEach((item) => {
        const previewGif = item.images.preview_gif.url.split('?')[0];
        const originalGif = item.images.original.url.split('?')[0];
        items.push({
          title: item.title,
          subtitle: formatBytes(item.images.original.size),
          arg: originalGif + '#' + item.id,
          icon: {
            path: `${process.env.alfred_workflow_cache}/${item.id}_preview.gif`
          },
          quicklookurl: `file://${process.env.alfred_workflow_cache.replace(/\s/g, '%20')}/${
            item.id
          }_preview.gif`
        });

        downloadPreviewGifs.push(
          exec(
            `curl "${previewGif}" -v --output "${process.env.alfred_workflow_cache}/${item.id}_preview.gif"`
          )
        );
      });
      console.log(
        JSON.stringify({
          items
        })
      );
      Promise.all(downloadPreviewGifs);
    })
    .catch((e) => {
      console.log(e);
    });

async function main() {
  /**
   * @description
   * find /Users/xxx/Library/Caches/com.runningwithcrayons.Alfred/Workflow\ Data/cn.alanhe.giphy -mtime +1 -type f -delete
   */
  await exec(
    `find ${process.env.alfred_workflow_cache.replace(/\s/g, '\\ ')} -mtime +1 -type f -delete`
  );
  searchGif();
}

main();

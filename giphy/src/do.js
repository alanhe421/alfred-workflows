const [, , query] = process.argv;
const instance = require('./axios').createHttpClient();
const fs = require('fs');
const { resolve } = require('path');
const Path = require('path');
const [URL, TITLE] = query.split('#');
const https = require('https');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function convertMp4ToGif(source, destination) {
  const { stdout, stderr } = await exec(
    `/usr/local/bin/ffmpeg -i '${source}' '${destination}'`
  );
}

const mp4Item = `${TITLE}.mp4`;
const gifItem = `${TITLE}.gif`;
const mp4FilePath = Path.resolve(__dirname, 'caches', mp4Item);
const gifFilePath = Path.resolve(__dirname, 'caches', gifItem);
const fileStream = fs.createWriteStream(mp4FilePath);

https.get(
  {
    host: 'media2.giphy.com',
    port: 443,
    path: URL,
    query: {
      api_key: 'Gz9oMSpG2PDXkiFwcgh5wyg243U9OHFg'
    }
  },
  (res) => {
    if (res.statusCode !== 200) {
      console.log(res.statusCode);
      return;
    }

    res.on('end', () => {});

    fileStream
      .on('finish', async () => {
        fileStream.close();
        await convertMp4ToGif(mp4FilePath, gifFilePath);
        fs.unlinkSync(mp4FilePath);
        console.log(gifFilePath);
      })
      .on('error', (err) => {
        fs.unlink(dest);
      });

    res.pipe(fileStream);
  }
);

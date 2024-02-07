const axios = require('axios');
const fs = require('fs');
const [, , TOKEN, AUTHOR_ID, FILE] = process.argv;
const { extractMeta } = require('./hexo-parser');
const { publishStatus } = process.env;

const statusToPages={
'draft':'drafts',
'public':'public',
'unlisted':'',
}

function main() {
  const files = FILE.split('\t');
  const fileDatas = files
    .map((f) => fs.readFileSync(f, 'utf8'))
    .map(extractMeta);
  return Promise.all(fileDatas.map((f) => createPost(f))).then((res) => {
    process.stdout.write(statusToPages[publishStatus]);
  });
}

/**
 * @description
 * 创建Story
 */
function createPost(data) {
  return axios.post(
      `https://api.medium.com/v1/users/${AUTHOR_ID}/posts`,
      {
        title: data.title,
        contentFormat: 'markdown',
        content: data.data,
        tags: data.tags,
        /**
         *  “public”, “draft”, or “unlisted”
         */
        publishStatus: publishStatus,
        canonicalUrl: data.canonicalUrl
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    )
    .then(({ data: res }) => {
      return res;
    }).catch(() => {});
}

main();

const axios = require('axios');
const fs = require('fs');
const [, , TOKEN, AUTHOR_ID, FILE] = process.argv;
const { extractMeta } = require('./hexo-parser');

function main() {
  const fileData = fs.readFileSync(FILE, 'utf8');
  const data = extractMeta(fileData);
  createPost(data);
}

/**
 * @description
 * 创建Story
 */
function createPost(data) {
  axios
    .post(
      `https://api.medium.com/v1/users/${AUTHOR_ID}/posts`,
      {
        title: data.title,
        contentFormat: 'markdown',
        content: data.data,
        tags: data.tags,
        /**
         *  “public”, “draft”, or “unlisted”
         */
        publishStatus: process.env.publishStatus,
        canonicalUrl: data.canonicalUrl
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    )
    .then(({ data: res }) => {
      console.log(res.data.url);
    })
    .catch(() => {});
}

main();

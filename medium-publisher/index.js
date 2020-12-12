const axios = require('axios');
const fs = require('fs');
const [, , TOKEN, AUTHOR_ID, FILE] = process.argv;
const {extractMeta} = require("./hexo-parser");

function main() {
    const fileData = fs.readFileSync(FILE, 'utf8');
    const res = extractMeta(fileData);
    createPost(res);
}

/**
 * @description
 * 创建Story
 */
function createPost(res) {
    axios
        .post(
            `https://api.medium.com/v1/users/${AUTHOR_ID}/posts`,
            {
                title: res.title,
                contentFormat: 'markdown',
                content: res.data,
                tags: res.tags,
                publishStatus: 'draft',
                canonicalUrl: res.canonicalUrl,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        .then(({data: res}) => {
            console.log(res.data.url);
        })
        .catch(() => {
        });
}

main();

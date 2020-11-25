const axios = require('axios');
const fs = require('fs');
const [, , TOKEN, AUTHOR_ID, FILE] = process.argv;

function main() {
    const fileData = fs.readFileSync(FILE, 'utf8');
    const res = extractMeta(fileData);
    createPost(res);
}

/**
 * @description
 * UserID不会变
 */
function getUserInfo() {
    axios
        .get(
            `https://api.medium.com/v1/me`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        .then((e) => {
            console.log(e);
        })
        .catch((e) => {
            console.error(e);
            console.log(-1);
        });
}

/**
 * 解析MD文件内容，获取元数据
 * @param data
 * @returns {{data, canonicalUrl: string, title, tags: *}}
 */
function extractMeta(data) {
    const MetaBlockRegex = /^---(\s|\S)*---\n/;
    const metaData = data.match(MetaBlockRegex)[0];
    data = data.replace(MetaBlockRegex, '');
    const title = metaData.match(/(?<=title:\s)[\u4e00-\u9fa5\s\w]*\S(?=\n\S)/)[0];
    const abbrlink = metaData.match(/(?<=\s{3}-\s)([\u4e00-\u9fa5\s\w]*)(?=\n)/);
    const tags = metaData.match(/(?<=\s{3}-\s)[\u4e00-\u9fa5\s\w]*(?=\n)/);
    const createDate = new Date(metaData.match(/(?<=date:\s)\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/)[0]);
    const canonicalUrl = `https://1991421.cn/${createDate.getFullYear()}/${createDate.getMonth() + 1}/${createDate.getDate()}/${abbrlink}`;
    return {data, title, tags, canonicalUrl};
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
                canonicalUrl: res.canonicalUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        )
        .then((e) => {
            console.log(0);
        })
        .catch((e) => {
            console.log(-1);
        });
}

main();

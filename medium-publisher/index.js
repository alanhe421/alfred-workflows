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
    const title = data.match(/(?<=title:\s)\S+(?=\n)/)[0];
    const abbrlink = data.match(/(?<=abbrlink:\s)(\s|\S)*(?=date)/)[0];
    const tags = data.match(/(?<=tags:\n)(\s|\S)*(?=(abbrlink|---))/)[0].match(/(?<=-\s)\S+(?=(\n|$))/g);
    const createDate = new Date(data.match(/(?<=date:\s)(\s|\S)*(?=\n---)/)[0]);
    const canonicalUrl = `https://1991421.cn/${createDate.getFullYear()}/${createDate.getMonth() + 1}/${createDate.getDate()}/${abbrlink}`;
    data = data.replace(/^---(\s|\S)*---\n/, '')
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

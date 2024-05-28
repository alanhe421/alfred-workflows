const header_block_regExp = /^---(\s|\S)*---\n/;
const abbrlink_regexp = /(?<=abbrlink:\s).*(?=\n)/;
const title_regexp = /(?<=title:\s).*?(?=\n)/;
const tag_regexp = /(?<=-( )+).+(?!-)/g;
const data_regexp = /(?<=date:\s)\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;

/**
 * 解析MD文件内容，获取元数据
 * @param data
 * @returns {{data, canonicalUrl: string, title, tags: *}}
 */
function extractMeta(data) {
    const MetaBlockRegex = header_block_regExp;
    const metaData = data.match(MetaBlockRegex)[0];
    data = data.replace(MetaBlockRegex, '');
    const title = metaData.match(
        title_regexp
    )[0]?.replace(/^['"]|['"]$/g, '');

    const abbrlink = metaData.match(abbrlink_regexp);
    const tags = metaData.match(tag_regexp);
    const createDate = new Date(
        metaData.match(data_regexp)[0]
    );
    const canonicalUrl = `https://1991421.cn/${createDate.getFullYear()}/${
        createDate.getMonth() + 1
    }/${createDate.getDate()}/${abbrlink}`;
    return {data, title, tags, canonicalUrl};
}

module.exports = {
    extractMeta
};

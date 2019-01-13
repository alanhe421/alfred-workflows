const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const url = 'http://ly6080.com.cn'
var keyword = process.argv[2];
console.error(keyword);

async function searchMovies() {
    const res = await axios.get(url + '/index.php?m=vod-search&wd=' + encodeURI(keyword));
    var $ = cheerio.load(res.data);
    var arr = $('.index-area').find('li');
    var result_array = [];
    for (var i = 0; i < arr.length; i++) {
        const item = arr.eq(i);
        const actors = [];
        item.find('.actor').each(function (i, elem) {
            actors.push($(this).text());
        });
        const imgUrl = item.find('img').attr('data-original');
        const imgName = imgUrl.slice(imgUrl.lastIndexOf('/') + 1);
        if (!fs.existsSync('./thumbs/' + imgName)) {
            const imgData = (await axios.get(imgUrl, { responseType:"arraybuffer" })).data;
            fs.writeFileSync('./thumbs/' + imgName,imgData);
        }
        result_array.push({
            title: item.find('.name').text(),
            subtitle: actors.join('/'),
            arg: url + item.find('.link-hover').attr('href'),
            icon: {
                path: __dirname + '/thumbs/' + imgName
            }
        })
    }
    console.log(JSON.stringify({ items: result_array }));
}
searchMovies();

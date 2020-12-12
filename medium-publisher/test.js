const fs = require('fs');
const {extractMeta} = require("./hexo-parser");
const fileData = fs.readFileSync('./sample.txt', 'utf8');
const res = extractMeta(fileData);
console.log(res);

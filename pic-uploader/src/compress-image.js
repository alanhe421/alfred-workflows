/*
 * 如有设定tinypng压缩配置，且压缩次数限制还没超，则进行在线图片压缩
 */
const [, , query] = process.argv;
const tinify = require("tinify");
const path = require("path");
const {utils} = require("@stacker/alfred-utils");
if (process.env.tinypng_api_key) {
  try {
    const filePath = path.join(process.env.alfred_workflow_cache, query);
    let source = tinify.fromFile(filePath);
    tinify.key = process.env.tinypng_api_key;
    source.toFile(filePath);
  } catch {

  }
}
utils.log(query);


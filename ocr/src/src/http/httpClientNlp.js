'use strict';
/**
 * Copyright (c) 2017 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file httpClientNlp类
 * @author baiduAip
 */
const iconv = require('iconv-lite');
const HttpClient = require('./httpClient');
const objectTools = require('../util/objectTools');
const request = require('request');
const code = require('../const/code');

/**
 * HttpClientNlp类
 * nlp接口调用使用GBK编码解码实现,依赖iconv-lite库
 * @see https://github.com/ashtuchkin/iconv-lite
 *
 * @class
 * @extends HttpClient
 * @constructor
 */
class HttpClientNlp extends HttpClient {
    constructor() {
        super();
    }
    req(options) {
        // 首先处理设置INTERCEPTOR的情况
        if (objectTools.isFunction(HttpClient.REQUEST_INTERCEPTOR)) {
            options = HttpClient.REQUEST_INTERCEPTOR(options);
        // 其次设置全局request options的
        } else if (objectTools.isObject(HttpClient.REQUEST_GLOBAL_OPTIONS)) {
            options = objectTools.merge(HttpClient.REQUEST_GLOBAL_OPTIONS, options);
        }

        return new Promise(function(resolve, reject) {
            request(options, function(error, response, body) {
                if (error === null) {
                    let buffer = new Buffer(body);
                    let decodedBody = iconv.decode(buffer, code.GBK);
                    try {
                        resolve(JSON.parse(decodedBody));
                    } catch (e) {
                        // 无法解析json请求，就返回原始body
                        resolve(decodedBody);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }
    postWithInfo(requestInfo) {
        let body = this.createBody(requestInfo.params);
        let options = {
            method: requestInfo.method,
            url: requestInfo.getUrl(),
            headers: requestInfo.headers,
            encoding: null,
            timeout: HttpClient.DEFAULT_TIMEOUT,
            body: body
        };
        return this.req(options);
    }
    createBody(param) {
        let body = null;
        body = iconv.encode(JSON.stringify(param), code.GBK);
        return body;
    }
}

module.exports = HttpClientNlp;
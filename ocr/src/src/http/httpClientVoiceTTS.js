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
 * @file httpClientExt类
 * @author baiduAip
 */

const HttpClient = require('./httpClient');
const crypto = require('crypto');

/**
 * HttpClientVoice类
 * 百度语音接口调用封装
 * 参考文档：http://speech.baidu.com/docs/asr/57
 *
 * @class
 * @extends HttpClient
 * @constructor
 */
class HttpClientVoiceTTS extends HttpClient {
    constructor() {
        super();
    }
    postWithInfo(requestInfo) {
        requestInfo.params.tok = requestInfo.getAccessToken();
        if (requestInfo.params.tok === null) {
            requestInfo.params.tok = 'bcekey';
        }
        if (typeof requestInfo.params.cuid === 'undefined') {
            requestInfo.params.cuid = this.genMd5(requestInfo.params.tok);
        }

        let options = {
            method: requestInfo.method,
            url: requestInfo.getPureUrl(),
            headers: requestInfo.headers,
            encoding: null,
            timeout: HttpClient.DEFAULT_TIMEOUT,
            form: requestInfo.params
        };

        return this.req(options).then(function(data) {
            if (data instanceof Buffer) {
                return {data: data}
            }
            return data;
        });
    }
    genMd5(str) {
        let md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    }
}

module.exports = HttpClientVoiceTTS;
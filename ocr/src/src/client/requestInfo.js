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
 * @file requestInfo
 * @author baiduAip
 */
const HttpHeader = require('../const/httpHeader');

const CloudAuth = require('../auth/cloudAuth');

const HOST_DEFAULT = 'aip.baidubce.com';

const CONTENT_TYPE_FORMDEFAULT = 'application/x-www-form-urlencoded';

const SYMBOL_QUERYSTRING_PREFIX = '?aipSdk=node&access_token=';
const SYMBOL_QUERYSTRING_PREFIX_BCE = '?aipSdk=node';

const SYMBOL_HTTPS_PREFIX = 'https://';
const SYMBOL_HTTP_PREFIX = 'http://';

 /**
 * RequestInfo类
 * 构造供request库调用的请求信息对象
 *
 * @constructor
 */
class RequestInfo {
    constructor(path, params, method, isHttp, headers) {
        this.isHttp = isHttp || false;
        this.method = method;
        this.host = HOST_DEFAULT;
        this.path = path;
        this.params = params;
        this.createDate = new Date();
        this.mergeHeaders = headers || {};
        this.devAccessToken = null;
        this.initCommonHeader();
    }
    setHost(host) {
        this.host = host;
        this.headers[HttpHeader.HOST] = this.host;
    }
    initCommonHeader() {
        this.headers = {};
        this.headers[HttpHeader.HOST] = this.host;
        this.headers[HttpHeader.CONTENT_TYPE] = CONTENT_TYPE_FORMDEFAULT;
        for (let p in this.mergeHeaders) {
            this.headers[p] = this.mergeHeaders[p];
        }
    }
    makeDevOptions(devAccessToken) {
        this.devAccessToken = devAccessToken;
        this.path += SYMBOL_QUERYSTRING_PREFIX + devAccessToken.token;
    }
    makeBceOptions(ak, sk) {
        let cloudAuth = new CloudAuth(ak, sk);
        this.headers[HttpHeader.BCE_DATE] = this.getUTCDateStr();
        let signature = cloudAuth.getAuthorization(this.method,
            this.path, {aipSdk: 'node'}, this.headers, this.createDate.getTime());
        this.headers[HttpHeader.BCE_AUTHORIZATION] = signature;
    }
    getUTCDateStr() {
        let dateStrUTC = this.createDate.toISOString().replace(/\.\d+Z$/, 'Z');
        return dateStrUTC;
    }
    getAccessToken() {
        if (this.devAccessToken !== null) {
            return this.devAccessToken.token;
        }
        return null;
    }
    getUrl() {
        if (this.isHttp) {
            return this.getHttpUrl();
        }
        return this.getHttpsUrl();
    }
    getPureUrl() {
        return this.getUrl().split('?')[0];
    }
    getHttpsUrl() {
        return SYMBOL_HTTPS_PREFIX + this.host + this.path + SYMBOL_QUERYSTRING_PREFIX_BCE;
    }
    getHttpUrl() {
        return SYMBOL_HTTP_PREFIX + this.host + this.path + SYMBOL_QUERYSTRING_PREFIX_BCE;
    }
 }

module.exports = RequestInfo;

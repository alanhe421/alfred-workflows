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
 * @file devAuthToken
 * @author baiduAip
 */
const devScope = require('../const/devScope');

/**
 * 提前获取access_token的时间 默认24个小时
 *
 * @type {number}
 */
let DEFAULT_FETCH_AHEAD_DURATION = 24 * 60 * 60 * 1000;

 /**
 * devAuthToken类
 * 百度开发者token信息包装类
 *
 * @constructor
 * @param {string} token access_token
 * @param {number} expireTime 多久之后过期
 * @param {string} scope 权限
 */
class DevAuthToken {
    constructor(token, expireTime, scope) {
        this.token = token;
        this.expireTime = expireTime;
        this.scope = scope;
        this.authDate = new Date();
        this.hasScopeFlag = false;
        this.initScope();
    }
    initScope() {
        // 用户自建token，默认为有权限
        if (this.scope == null) {
            this.hasScopeFlag = true;
            return;
        }
        let scopeArray = this.scope.split(' ');
        scopeArray.forEach(function (item) {
            if (item === devScope) {
                this.hasScopeFlag = true;
            }
        }.bind(this));
    }
    hasScope(scope) {
        return this.hasScopeFlag;
    }
    isExpired() {
        let now = new Date();
        // 根据服务器返回的access_token过期时间，提前重新获取token
        if (now.getTime(this.expireTime) -
            this.authDate.getTime() > this.expireTime * 1000 -
                DEFAULT_FETCH_AHEAD_DURATION) {
            return true;
        }
        return false;
    }
}

/**
 * 设置提前获取access_token的时间
 */
DevAuthToken.setExpireAhead = function (duration) {
    DEFAULT_FETCH_AHEAD_DURATION = duration;
}

DevAuthToken.DEFAULT_EXPIRE_DURATION = 2592000 * 1000;

module.exports = DevAuthToken;

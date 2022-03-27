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
 * @file objectTool
 * @author baiduAip
 */

let mergeTool = {
    merge: function (source, dest) {
        let merged = {};
        for (let p in dest) {
            merged[p] = dest[p];
        }
        for (let p in source) {
            merged[p] = source[p];
        }
        return merged;
    },
    ensureArray: function (arrayLike) {
        if (this.isArray(arrayLike)) {
            return arrayLike;
        } else {
            return [arrayLike];
        }
    },
    isArray: function (obj) {
        return '[object Array]' === Object.prototype.toString.call(obj);
    },
    isObject: function (obj) {
        return '[object Object]' === Object.prototype.toString.call(obj);
    },
    isFunction: function (obj) {
        return '[object Function]' === Object.prototype.toString.call(obj);
    }
};

module.exports = mergeTool;

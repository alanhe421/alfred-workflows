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
 * @file http头常量
 * @author baiduAip
 */
const httpHeader = {
    BCE_DATE: 'x-bce-date',
    HOST: 'Host',
    BCE_AUTHORIZATION: 'authorization',
    CONTENT_TYPE: 'Content-Type'
};

module.exports = Object.freeze(httpHeader);
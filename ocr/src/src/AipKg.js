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
 * @file AipKg.js
 * @author baidu aip
 */



const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClient');

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const CREATE_TASK_PATH = '/rest/2.0/kg/v1/pie/task_create';
const UPDATE_TASK_PATH = '/rest/2.0/kg/v1/pie/task_update';
const TASK_INFO_PATH = '/rest/2.0/kg/v1/pie/task_info';
const TASK_QUERY_PATH = '/rest/2.0/kg/v1/pie/task_query';
const TASK_START_PATH = '/rest/2.0/kg/v1/pie/task_start';
const TASK_STATUS_PATH = '/rest/2.0/kg/v1/pie/task_status';


/**
 * AipKg类
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipKg extends BaseClient {
    constructor(appId, ak, sk) {
        super(appId, ak, sk);
    }
    commonImpl(param) {
        let httpClient = new HttpClient();
        let apiUrl = param.targetPath;
        delete param.targetPath;
        let requestInfo = new RequestInfo(apiUrl,
            param, METHOD_POST);
        return this.doRequest(requestInfo, httpClient);
    }

    /**
     * 创建任务接口
     *
     * @param {string} name - 任务名字
     * @param {string} templateContent - json string 解析模板内容
     * @param {string} inputMappingFile - 抓取结果映射文件的路径
     * @param {string} outputFile - 输出文件名字
     * @param {string} urlPattern - url pattern
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   limit_count 限制解析数量limit_count为0时进行全量任务，limit_count&gt;0时只解析limit_count数量的页面
     * @return {Promise} - 标准Promise对象
     */
    createTask(name, templateContent, inputMappingFile, outputFile, urlPattern, options) {
        let param = {
            name: name,
            template_content: templateContent,
            input_mapping_file: inputMappingFile,
            output_file: outputFile,
            url_pattern: urlPattern,
            targetPath: CREATE_TASK_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 更新任务接口
     *
     * @param {integer} id - 任务ID
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   name 任务名字
     *   template_content json string 解析模板内容
     *   input_mapping_file 抓取结果映射文件的路径
     *   url_pattern url pattern
     *   output_file 输出文件名字
     * @return {Promise} - 标准Promise对象
     */
    updateTask(id, options) {
        let param = {
            id: id,
            targetPath: UPDATE_TASK_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 获取任务详情接口
     *
     * @param {integer} id - 任务ID
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    getTaskInfo(id, options) {
        let param = {
            id: id,
            targetPath: TASK_INFO_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 以分页的方式查询当前用户所有的任务信息接口
     *
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   id 任务ID，精确匹配
     *   name 中缀模糊匹配,abc可以匹配abc,aaabc,abcde等
     *   status 要筛选的任务状态
     *   page 页码
     *   per_page 页码
     * @return {Promise} - 标准Promise对象
     */
    getUserTasks(options) {
        let param = {
            targetPath: TASK_QUERY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 启动任务接口
     *
     * @param {integer} id - 任务ID
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    startTask(id, options) {
        let param = {
            id: id,
            targetPath: TASK_START_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 查询任务状态接口
     *
     * @param {integer} id - 任务ID
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    getTaskStatus(id, options) {
        let param = {
            id: id,
            targetPath: TASK_STATUS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
}

module.exports = AipKg;


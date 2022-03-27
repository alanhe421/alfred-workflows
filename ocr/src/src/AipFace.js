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
 * @file AipFace.js
 * @author baidu aip
 */



const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClientExt');

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const DETECT_PATH = '/rest/2.0/face/v3/detect';
const SEARCH_PATH = '/rest/2.0/face/v3/search';
const USER_ADD_PATH = '/rest/2.0/face/v3/faceset/user/add';
const USER_UPDATE_PATH = '/rest/2.0/face/v3/faceset/user/update';
const FACE_DELETE_PATH = '/rest/2.0/face/v3/faceset/face/delete';
const USER_GET_PATH = '/rest/2.0/face/v3/faceset/user/get';
const FACE_GETLIST_PATH = '/rest/2.0/face/v3/faceset/face/getlist';
const GROUP_GETUSERS_PATH = '/rest/2.0/face/v3/faceset/group/getusers';
const USER_COPY_PATH = '/rest/2.0/face/v3/faceset/user/copy';
const USER_DELETE_PATH = '/rest/2.0/face/v3/faceset/user/delete';
const GROUP_ADD_PATH = '/rest/2.0/face/v3/faceset/group/add';
const GROUP_DELETE_PATH = '/rest/2.0/face/v3/faceset/group/delete';
const GROUP_GETLIST_PATH = '/rest/2.0/face/v3/faceset/group/getlist';
const PERSON_VERIFY_PATH = '/rest/2.0/face/v3/person/verify';
const VIDEO_SESSIONCODE_PATH = '/rest/2.0/face/v1/faceliveness/sessioncode';


/**
 * AipFace类
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipFace extends BaseClient {
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
     * 人脸检测接口
     *
     * @param {string} image - 图片信息(**总数据大小应小于10M**)，图片上传方式根据image_type来判断
     * @param {string} imageType - 图片类型 **BASE64**:图片的base64值，base64编码后的图片数据，需urlencode，编码后的图片大小不超过2M；**URL**:图片的 URL地址( 可能由于网络等原因导致下载图片时间过长)**；FACE_TOKEN**: 人脸图片的唯一标识，调用人脸检测接口时，会为每个人脸图片赋予一个唯一的FACE_TOKEN，同一张图片多次检测得到的FACE_TOKEN是同一个
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   face_field 包括**age,beauty,expression,faceshape,gender,glasses,landmark,race,quality,facetype信息**  <br> 逗号分隔. 默认只返回face_token、人脸框、概率和旋转角度
     *   max_face_num 最多处理人脸的数目，默认值为1，仅检测图片中面积最大的那个人脸；**最大值10**，检测图片中面积最大的几张人脸。
     *   face_type 人脸的类型 **LIVE**表示生活照：通常为手机、相机拍摄的人像图片、或从网络获取的人像图片等**IDCARD**表示身份证芯片照：二代身份证内置芯片中的人像照片 **WATERMARK**表示带水印证件照：一般为带水印的小图，如公安网小图 **CERT**表示证件照片：如拍摄的身份证、工卡、护照、学生证等证件图片 默认**LIVE**
     * @return {Promise} - 标准Promise对象
     */
    detect(image, imageType, options) {
        let param = {
            image: image,
            image_type: imageType,
            targetPath: DETECT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人脸搜索接口
     *
     * @param {string} image - 图片信息(**总数据大小应小于10M**)，图片上传方式根据image_type来判断
     * @param {string} imageType - 图片类型 **BASE64**:图片的base64值，base64编码后的图片数据，需urlencode，编码后的图片大小不超过2M；**URL**:图片的 URL地址( 可能由于网络等原因导致下载图片时间过长)**；FACE_TOKEN**: 人脸图片的唯一标识，调用人脸检测接口时，会为每个人脸图片赋予一个唯一的FACE_TOKEN，同一张图片多次检测得到的FACE_TOKEN是同一个
     * @param {string} groupIdList - 从指定的group中进行查找 用逗号分隔，**上限20个**
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   quality_control 图片质量控制  **NONE**: 不进行控制 **LOW**:较低的质量要求 **NORMAL**: 一般的质量要求 **HIGH**: 较高的质量要求 **默认 NONE**
     *   liveness_control 活体检测控制  **NONE**: 不进行控制 **LOW**:较低的活体要求(高通过率 低攻击拒绝率) **NORMAL**: 一般的活体要求(平衡的攻击拒绝率, 通过率) **HIGH**: 较高的活体要求(高攻击拒绝率 低通过率) **默认NONE**
     *   user_id 当需要对特定用户进行比对时，指定user_id进行比对。即人脸认证功能。
     *   max_user_num 查找后返回的用户数量。返回相似度最高的几个用户，默认为1，最多返回20个。
     * @return {Promise} - 标准Promise对象
     */
    search(image, imageType, groupIdList, options) {
        let param = {
            image: image,
            image_type: imageType,
            group_id_list: groupIdList,
            targetPath: SEARCH_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人脸注册接口
     *
     * @param {string} image - 图片信息(**总数据大小应小于10M**)，图片上传方式根据image_type来判断
     * @param {string} imageType - 图片类型 **BASE64**:图片的base64值，base64编码后的图片数据，需urlencode，编码后的图片大小不超过2M；**URL**:图片的 URL地址( 可能由于网络等原因导致下载图片时间过长)**；FACE_TOKEN**: 人脸图片的唯一标识，调用人脸检测接口时，会为每个人脸图片赋予一个唯一的FACE_TOKEN，同一张图片多次检测得到的FACE_TOKEN是同一个
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   user_info 用户资料，长度限制256B
     *   quality_control 图片质量控制  **NONE**: 不进行控制 **LOW**:较低的质量要求 **NORMAL**: 一般的质量要求 **HIGH**: 较高的质量要求 **默认 NONE**
     *   liveness_control 活体检测控制  **NONE**: 不进行控制 **LOW**:较低的活体要求(高通过率 低攻击拒绝率) **NORMAL**: 一般的活体要求(平衡的攻击拒绝率, 通过率) **HIGH**: 较高的活体要求(高攻击拒绝率 低通过率) **默认NONE**
     * @return {Promise} - 标准Promise对象
     */
    addUser(image, imageType, groupId, userId, options) {
        let param = {
            image: image,
            image_type: imageType,
            group_id: groupId,
            user_id: userId,
            targetPath: USER_ADD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人脸更新接口
     *
     * @param {string} image - 图片信息(**总数据大小应小于10M**)，图片上传方式根据image_type来判断
     * @param {string} imageType - 图片类型 **BASE64**:图片的base64值，base64编码后的图片数据，需urlencode，编码后的图片大小不超过2M；**URL**:图片的 URL地址( 可能由于网络等原因导致下载图片时间过长)**；FACE_TOKEN**: 人脸图片的唯一标识，调用人脸检测接口时，会为每个人脸图片赋予一个唯一的FACE_TOKEN，同一张图片多次检测得到的FACE_TOKEN是同一个
     * @param {string} groupId - 更新指定groupid下uid对应的信息
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   user_info 用户资料，长度限制256B
     *   quality_control 图片质量控制  **NONE**: 不进行控制 **LOW**:较低的质量要求 **NORMAL**: 一般的质量要求 **HIGH**: 较高的质量要求 **默认 NONE**
     *   liveness_control 活体检测控制  **NONE**: 不进行控制 **LOW**:较低的活体要求(高通过率 低攻击拒绝率) **NORMAL**: 一般的活体要求(平衡的攻击拒绝率, 通过率) **HIGH**: 较高的活体要求(高攻击拒绝率 低通过率) **默认NONE**
     * @return {Promise} - 标准Promise对象
     */
    updateUser(image, imageType, groupId, userId, options) {
        let param = {
            image: image,
            image_type: imageType,
            group_id: groupId,
            user_id: userId,
            targetPath: USER_UPDATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人脸删除接口
     *
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {string} faceToken - 需要删除的人脸图片token，（由数字、字母、下划线组成）长度限制64B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    faceDelete(userId, groupId, faceToken, options) {
        let param = {
            user_id: userId,
            group_id: groupId,
            face_token: faceToken,
            targetPath: FACE_DELETE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 用户信息查询接口
     *
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    getUser(userId, groupId, options) {
        let param = {
            user_id: userId,
            group_id: groupId,
            targetPath: USER_GET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 获取用户人脸列表接口
     *
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    faceGetlist(userId, groupId, options) {
        let param = {
            user_id: userId,
            group_id: groupId,
            targetPath: FACE_GETLIST_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 获取用户列表接口
     *
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   start 默认值0，起始序号
     *   length 返回数量，默认值100，最大值1000
     * @return {Promise} - 标准Promise对象
     */
    getGroupUsers(groupId, options) {
        let param = {
            group_id: groupId,
            targetPath: GROUP_GETUSERS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 复制用户接口
     *
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   src_group_id 从指定组里复制信息
     *   dst_group_id 需要添加用户的组id
     * @return {Promise} - 标准Promise对象
     */
    userCopy(userId, options) {
        let param = {
            user_id: userId,
            targetPath: USER_COPY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 删除用户接口
     *
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {string} userId - 用户id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    deleteUser(groupId, userId, options) {
        let param = {
            group_id: groupId,
            user_id: userId,
            targetPath: USER_DELETE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 创建用户组接口
     *
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    groupAdd(groupId, options) {
        let param = {
            group_id: groupId,
            targetPath: GROUP_ADD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 删除用户组接口
     *
     * @param {string} groupId - 用户组id（由数字、字母、下划线组成），长度限制128B
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    groupDelete(groupId, options) {
        let param = {
            group_id: groupId,
            targetPath: GROUP_DELETE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 组列表查询接口
     *
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   start 默认值0，起始序号
     *   length 返回数量，默认值100，最大值1000
     * @return {Promise} - 标准Promise对象
     */
    getGrouplist(options) {
        let param = {
            targetPath: GROUP_GETLIST_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 身份验证接口
     *
     * @param {string} image - 图片信息(**总数据大小应小于10M**)，图片上传方式根据image_type来判断
     * @param {string} imageType - 图片类型 **BASE64**:图片的base64值，base64编码后的图片数据，需urlencode，编码后的图片大小不超过2M；**URL**:图片的 URL地址( 可能由于网络等原因导致下载图片时间过长)**；FACE_TOKEN**: 人脸图片的唯一标识，调用人脸检测接口时，会为每个人脸图片赋予一个唯一的FACE_TOKEN，同一张图片多次检测得到的FACE_TOKEN是同一个
     * @param {string} idCardNumber - 身份证号（真实身份证号号码）
     * @param {string} name - utf8，姓名（真实姓名，和身份证号匹配）
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   quality_control 图片质量控制  **NONE**: 不进行控制 **LOW**:较低的质量要求 **NORMAL**: 一般的质量要求 **HIGH**: 较高的质量要求 **默认 NONE**
     *   liveness_control 活体检测控制  **NONE**: 不进行控制 **LOW**:较低的活体要求(高通过率 低攻击拒绝率) **NORMAL**: 一般的活体要求(平衡的攻击拒绝率, 通过率) **HIGH**: 较高的活体要求(高攻击拒绝率 低通过率) **默认NONE**
     * @return {Promise} - 标准Promise对象
     */
    personVerify(image, imageType, idCardNumber, name, options) {
        let param = {
            image: image,
            image_type: imageType,
            id_card_number: idCardNumber,
            name: name,
            targetPath: PERSON_VERIFY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 语音校验码接口接口
     *
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   appid 百度云创建应用时的唯一标识ID
     * @return {Promise} - 标准Promise对象
     */
    videoSessioncode(options) {
        let param = {
            targetPath: VIDEO_SESSIONCODE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
    /**
     * 在线活体检测
     *
     * @param {Object} param - 参数对象数组
     * @return {Promise} - 标准Promise对象
     * > 说明：两张图片的对象举例：
     * >
     * > [
     * >     {
     * >         "image": "sfasq35sadvsvqwr5q...",
     * >         "image_type": "BASE64",
     * >         "face_field": "quality"
     * >     },
     * >     {
     * >         "image": "sfasq35sadvsvqwr5q...",
     * >         "image_type": "BASE64",
     * >         "face_field": "quality"
     * >     }
     * > ]
     */
    faceverify(object) {
        const FACEVERIFY_PATH = '/rest/2.0/face/v3/faceverify';
        const HttpClientExt = require('./http/httpClientExt');
        let httpClientJson = new HttpClientExt();
        let requestInfo = new RequestInfo(FACEVERIFY_PATH,
            object, METHOD_POST);
        return this.doRequest(requestInfo, httpClientJson);
    }

    /**
     * 人脸比对接口
     *
     * @param {Object} param - 参数对象数组
     * @return {Promise} - 标准Promise对象
     * > 说明：两张图片的对象举例：
     * >
     * > [
     * >     {
     * >         "image": "sfasq35sadvsvqwr5q...",
     * >         "image_type": "BASE64",
     * >         "face_type": "LIVE",
     * >         "quality_control": "LOW",
     * >         "liveness_control": "HIGH"
     * >     },
     * >     {
     * >         "image": "sfasq35sadvsvqwr5q...",
     * >         "image_type": "BASE64",
     * >         "face_type": "IDCARD",
     * >         "quality_control": "LOW",
     * >         "liveness_control": "HIGH"
     * >     }
     * > ]
     */
    match(object) {
        const MATCH_PATH = '/rest/2.0/face/v3/match';
        const HttpClientExt = require('./http/httpClientExt');
        let httpClientJson = new HttpClientExt();
        let requestInfo = new RequestInfo(MATCH_PATH,
            object, METHOD_POST);
        return this.doRequest(requestInfo, httpClientJson);
    }
}

module.exports = AipFace;


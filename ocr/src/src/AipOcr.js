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
 * @file AipOcr.js
 * @author baidu aip
 */

const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClient');

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const GENERAL_BASIC_PATH = '/rest/2.0/ocr/v1/general_basic';
const ACCURATE_BASIC_PATH = '/rest/2.0/ocr/v1/accurate_basic';
const GENERAL_PATH = '/rest/2.0/ocr/v1/general';
const ACCURATE_PATH = '/rest/2.0/ocr/v1/accurate';
const GENERAL_ENHANCED_PATH = '/rest/2.0/ocr/v1/general_enhanced';
const WEB_IMAGE_PATH = '/rest/2.0/ocr/v1/webimage';
const IDCARD_PATH = '/rest/2.0/ocr/v1/idcard';
const BANKCARD_PATH = '/rest/2.0/ocr/v1/bankcard';
const DRIVING_LICENSE_PATH = '/rest/2.0/ocr/v1/driving_license';
const VEHICLE_LICENSE_PATH = '/rest/2.0/ocr/v1/vehicle_license';
const LICENSE_PLATE_PATH = '/rest/2.0/ocr/v1/license_plate';
const BUSINESS_LICENSE_PATH = '/rest/2.0/ocr/v1/business_license';
const RECEIPT_PATH = '/rest/2.0/ocr/v1/receipt';
const TRAIN_TICKET_PATH = '/rest/2.0/ocr/v1/train_ticket';
const TAXI_RECEIPT_PATH = '/rest/2.0/ocr/v1/taxi_receipt';
const FORM_PATH = '/rest/2.0/ocr/v1/form';
const TABLE_RECOGNIZE_PATH = '/rest/2.0/solution/v1/form_ocr/request';
const TABLE_RESULT_GET_PATH = '/rest/2.0/solution/v1/form_ocr/get_request_result';
const VAT_INVOICE_PATH = '/rest/2.0/ocr/v1/vat_invoice';
const QRCODE_PATH = '/rest/2.0/ocr/v1/qrcode';
const NUMBERS_PATH = '/rest/2.0/ocr/v1/numbers';
const LOTTERY_PATH = '/rest/2.0/ocr/v1/lottery';
const PASSPORT_PATH = '/rest/2.0/ocr/v1/passport';
const BUSINESS_CARD_PATH = '/rest/2.0/ocr/v1/business_card';
const HANDWRITING_PATH = '/rest/2.0/ocr/v1/handwriting';
const CUSTOM_PATH = '/rest/2.0/solution/v1/iocr/recognise';


/**
 * AipOcr类
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipOcr extends BaseClient {
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
     * 通用文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalBasic(image, options) {
        let param = {
            image: image,
            targetPath: GENERAL_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别接口
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalBasicUrl(url, options) {
        let param = {
            url: url,
            targetPath: GENERAL_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度版）接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    accurateBasic(image, options) {
        let param = {
            image: image,
            targetPath: ACCURATE_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含位置信息版）接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   vertexes_location 是否返回文字外接多边形顶点位置，不支持单字位置。默认为false
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    general(image, options) {
        let param = {
            image: image,
            targetPath: GENERAL_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含位置信息版）接口
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   vertexes_location 是否返回文字外接多边形顶点位置，不支持单字位置。默认为false
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalUrl(url, options) {
        let param = {
            url: url,
            targetPath: GENERAL_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含位置高精度版）接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   vertexes_location 是否返回文字外接多边形顶点位置，不支持单字位置。默认为false
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    accurate(image, options) {
        let param = {
            image: image,
            targetPath: ACCURATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含生僻字版）接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalEnhance(image, options) {
        let param = {
            image: image,
            targetPath: GENERAL_ENHANCED_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含生僻字版）接口
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalEnhanceUrl(url, options) {
        let param = {
            url: url,
            targetPath: GENERAL_ENHANCED_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网络图片文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     * @return {Promise} - 标准Promise对象
     */
    webImage(image, options) {
        let param = {
            image: image,
            targetPath: WEB_IMAGE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网络图片文字识别接口
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     * @return {Promise} - 标准Promise对象
     */
    webImageUrl(url, options) {
        let param = {
            url: url,
            targetPath: WEB_IMAGE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 身份证识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {string} idCardSide - front：身份证含照片的一面；back：身份证带国徽的一面
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_risk 是否开启身份证风险类型(身份证复印件、临时身份证、身份证翻拍、修改过的身份证)功能，默认不开启，即：false。可选值:true-开启；false-不开启
     * @return {Promise} - 标准Promise对象
     */
    idcard(image, idCardSide, options) {
        let param = {
            image: image,
            id_card_side: idCardSide,
            targetPath: IDCARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 银行卡识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    bankcard(image, options) {
        let param = {
            image: image,
            targetPath: BANKCARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 驾驶证识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     * @return {Promise} - 标准Promise对象
     */
    drivingLicense(image, options) {
        let param = {
            image: image,
            targetPath: DRIVING_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 行驶证识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   accuracy normal 使用快速服务，1200ms左右时延；缺省或其它值使用高精度服务，1600ms左右时延
     * @return {Promise} - 标准Promise对象
     */
    vehicleLicense(image, options) {
        let param = {
            image: image,
            targetPath: VEHICLE_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 车牌识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   multi_detect 是否检测多张车牌，默认为false，当置为true的时候可以对一张图片内的多张车牌进行识别
     * @return {Promise} - 标准Promise对象
     */
    licensePlate(image, options) {
        let param = {
            image: image,
            targetPath: LICENSE_PLATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 营业执照识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    businessLicense(image, options) {
        let param = {
            image: image,
            targetPath: BUSINESS_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用票据识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   probability 是否返回识别结果中每一行的置信度
     *   accuracy normal 使用快速服务，1200ms左右时延；缺省或其它值使用高精度服务，1600ms左右时延
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     * @return {Promise} - 标准Promise对象
     */
    receipt(image, options) {
        let param = {
            image: image,
            targetPath: RECEIPT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 火车票识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    trainTicket(image, options) {
        let param = {
            image: image,
            targetPath: TRAIN_TICKET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 出租车票识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    taxiReceipt(image, options) {
        let param = {
            image: image,
            targetPath: TAXI_RECEIPT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格文字识别同步接口接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    form(image, options) {
        let param = {
            image: image,
            targetPath: FORM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    tableBegin(image, options) {
        let param = {
            image: image,
            targetPath: TABLE_RECOGNIZE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格识别结果接口
     *
     * @param {string} requestId - 发送表格文字识别请求时返回的request id
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   result_type 期望获取结果的类型，取值为“excel”时返回xls文件的地址，取值为“json”时返回json格式的字符串,默认为”excel”
     * @return {Promise} - 标准Promise对象
     */
    tableGetresult(requestId, options) {
        let param = {
            request_id: requestId,
            targetPath: TABLE_RESULT_GET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 增值税发票识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    vatInvoice(image, options) {
        let param = {
            image: image,
            targetPath: VAT_INVOICE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 二维码识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    qrcode(image, options) {
        let param = {
            image: image,
            targetPath: QRCODE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 数字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     * @return {Promise} - 标准Promise对象
     */
    numbers(image, options) {
        let param = {
            image: image,
            targetPath: NUMBERS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 彩票识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     * @return {Promise} - 标准Promise对象
     */
    lottery(image, options) {
        let param = {
            image: image,
            targetPath: LOTTERY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 护照识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    passport(image, options) {
        let param = {
            image: image,
            targetPath: PASSPORT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 名片识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    businessCard(image, options) {
        let param = {
            image: image,
            targetPath: BUSINESS_CARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 手写文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     * @return {Promise} - 标准Promise对象
     */
    handwriting(image, options) {
        let param = {
            image: image,
            targetPath: HANDWRITING_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 自定义模板文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   templateSign 您在自定义文字识别平台制作的模板的ID
     *   classifierId 分类器Id。这个参数和templateSign至少存在一个，优先使用templateSign。存在templateSign时，表示使用指定模板；如果没有templateSign而有classifierId，表示使用分类器去判断使用哪个模板
     * @return {Promise} - 标准Promise对象
     */
    custom(image, options) {
        let param = {
            image: image,
            targetPath: CUSTOM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
    tableRecorgnize(image, type, timeout, interval) {
        let self = this;
        timeout = timeout || 20000;
        interval = interval || 2000;
        return this.tableBegin(image).then(function(result) {
            if (result.error_code) {
                return result;
            }
            let id = result.result[0]['request_id'];
            let pid = null;
            let startTime = Date.now();
            return new Promise(function(resolve, reject) {
                pid = setInterval(function () {
                    if (Date.now() - startTime > timeout) {
                        reject({errorMsg: 'get result timeout', requestId: id});
                        clearInterval(pid);
                    } else {
                        self.tableGetresult(id, type).then(function (result) {
                            if (result['result']['ret_code'] === 3) {
                                clearInterval(pid);
                                resolve(result);
                            }
                        });
                    }
                }, interval);
            })
        });
    }
}

module.exports = AipOcr;



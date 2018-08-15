/*
    接口配调用文件
    by:David 2018.6.14
*/
import fly from './config'
import qs from 'qs'

import config from '../config'
const shareUrl = config.shareUrl
const host = config.host;
const appKey = config.appKey;
const appid = config.appid;

/**
 * 接口模版====post
 *
 * export const test = params => {return fly.post(`${root}/xx/xx`, qs.stringify(params))};
 *
 * 接口模版====get
 *
 * export const test1 = function(){return fly.get(`${root}/api/getNewsList`)}
 *
 *
 * 用法：
 * 在 页面用引入 test
 * import {test} from '../../http/api.js'
 *
 * test(params).then(res=>{ console.log(res) })
 */

// export const test = params => {
//     return fly.post(`${host}/xx/xx`, qs.stringify(params))
// };
// 通用的get请求
export const wxShareGet = (params) => {
    return fly.get(shareUrl, params)
};

// 通用的get请求
export const ajaxGet = (params) => {
    return fly.get(`${host}${params.url}`, 
    	params.data)
};

// 通用的post请求
export const ajaxPost = (params) => {
    return fly.post(`${host}${params.url}`, params.data)
};


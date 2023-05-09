import { request } from '@umijs/max';
import _throttle from 'lodash/throttle';
import qs from 'querystring';

/**
 * get请求
 * @param url
 * @param data
 * @param params
 * @returns https://axios-http.com/zh/docs/req_config
 */
function post(url: string, data?: any, params?: any) {
  const newUrl = params ? `${url}?${qs.stringify(params)}` : url;
  return request(newUrl, {
    data,
    method: 'POST',
  });
}
/**
 * post请求
 * @param url
 * @param params
 * @returns
 */
function get(url: string, params?: any) {
  return request(url, { params });
}

export { request, post, get };

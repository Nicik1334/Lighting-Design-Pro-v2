import type { RequestOptions } from '@@/plugin-request/request';
import { getDvaApp, RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import _ from 'lodash';
import NProgress from './components/common/NProgress';
import { CODE_MESSAGE, USER_TOKEN } from './constants';
import { showNotification } from './utils';

const logout = _.throttle(
  () => {
    message.error('登录已失效、请重新登录。');
    getDvaApp()._store.dispatch({ type: 'authModel/logout' });
  },
  1000,
  { leading: true, trailing: false },
);

export const errorConfig: RequestConfig = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 12000,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, msg } = res as unknown as HttpResult;
      if (!success) {
        const error: any = new Error(msg);
        throw error; // 抛出自制的错误
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      NProgress.start();
      const { headers, url } = config;
      config.headers = {
        ...headers,
        ticket: sessionStorage.getItem(USER_TOKEN) as string,
      };
      config.url = url?.startsWith('/mock') || url?.startsWith('/xxx') ? url : `${url}`;
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      NProgress.done();
      const { status } = response;
      if (status === 401) {
        logout();
        return { ...response, success: false };
      }
      if (status !== 200) {
        const errorText = CODE_MESSAGE[status] || response.statusText;
        showNotification('error', `请求错误 ${status}`, errorText);
        return { ...response, success: false };
      }
      return response;
    },
  ],
};

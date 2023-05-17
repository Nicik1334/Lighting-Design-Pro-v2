import { LoadingOutlined, setTwoToneColor } from '@ant-design/icons';
import { Settings as LayoutSettings } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Spin } from 'antd';
import defaultSettings, { SettingsTypes } from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
const loginPath = '/user/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings & SettingsTypes>;

  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

Spin.setDefaultIndicator(<LoadingOutlined spin />); // 设置全局loading样式
setTwoToneColor(defaultSettings.colorPrimary); // 设置全局twoTone图标颜色

export const request = {
  ...errorConfig,
};

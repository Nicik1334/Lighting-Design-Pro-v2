import { ProLayoutProps } from '@ant-design/pro-components';

export interface SettingsTypes {
  pwa?: boolean;
  logo?: string;
  tabView:
    | {
        /**
         * 展示路由Tab图标
         */
        tabIcon: boolean;
        /**
         * 展示路由Tab图标
         */
        cacheTabView: boolean;
      }
    | false;
}

/**
 * @name
 */
const Settings: ProLayoutProps & SettingsTypes = {
  navTheme: 'light',
  colorPrimary: '#13C2C2',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Ant Design Pro',
  pwa: true,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
  tabView: {
    tabIcon: true,
    cacheTabView: true,
  },
};

export default Settings;

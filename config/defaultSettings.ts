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
    //https://procomponents.ant.design/components/layout#token  通过token 修改样式
  },
  tabView: {
    tabIcon: true,
    cacheTabView: true,
  },
};

export default Settings;

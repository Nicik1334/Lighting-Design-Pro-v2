import RightContent from '@/components/system/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { MenuDataItem, PageLoading, Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { matchRoutes, RunTimeLayoutConfig, useAccessMarkedRoutes, useSelectedRoutes } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings, { SettingsTypes } from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import React from 'react';
import { AvatarDropdown, AvatarName } from './components/system/RightContent/AvatarDropdown';
import NProgress from './components/common/NProgress';
import { HOME_PATH } from './constants';
import BaseTabs from './components/system/BaseTabs';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const links = isDev
  ? [
      <a key="api" target="_blank">
        <LinkOutlined />
        <span>swagger文档</span>
      </a>,
      <a
        href="https://llq0802.github.io/lighting-design/"
        target="_blank"
        key="docs"
        rel="noreferrer"
      >
        <BookOutlined />
        <span>业务组件文档</span>
      </a>,
    ]
  : [];

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

// const ItemChildren = ({
//   itemProps,
//   defaultDom,
// }: {
//   itemProps: MenuDataItem;
//   defaultDom: React.ReactNode;
// }) => {
//   if (!itemProps) return null;
//   if (itemProps.isUrl || !itemProps.path || location.pathname === itemProps.path)
//     return <a>{defaultDom}</a>;
//   return <Link to={itemProps.path}>{defaultDom as any}</Link>;
// };

// const IconChildren = ({ itemProps }: { itemProps: MenuDataItem }) => {
//   if (!itemProps || itemProps.catalogue) return null;
//   if (typeof itemProps.icon === 'object') {
//     return (
//       <>
//         {itemProps.icon}
//         <span />
//       </>
//     );
//   }
//   return null;
// };

// // ProLayout 支持的api https://procomponents.ant.design/components/layout
// export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {


//   console.log(initialState);


//   return {
//     actionsRender: () => [<RightContent key="doc" />],
//     avatarProps: {
//       src: initialState?.currentUser?.avatar,
//       title: <AvatarName />,
//       render: (_, avatarChildren) => {
//         return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
//       },
//     },
//     waterMarkProps: {
//       content: initialState?.currentUser?.name,
//     },
//     footerRender: false,
//     onPageChange: () => {
//       // NProgress.start();
//       // const { location } = history;
//       // // 如果没有登录，重定向到 login
//       // if (!initialState?.currentUser && location.pathname !== loginPath) {
//       //   history.push(loginPath);
//       // }
//       // setTimeout(() => NProgress.done(), 300);
//     },
//     layoutBgImgList: [
//       {
//         src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
//         left: 85,
//         bottom: 100,
//         height: '303px',
//       },
//       {
//         src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
//         bottom: -68,
//         right: -45,
//         height: '303px',
//       },
//       {
//         src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
//         bottom: 0,
//         left: 0,
//         width: '331px',
//       },
//     ],
//     links,
//     menuHeaderRender: undefined,
//     menuItemRender: (itemProps, defaultDom: React.ReactNode) => (
//       <>
//         <IconChildren itemProps={itemProps} />
//         <ItemChildren itemProps={itemProps} defaultDom={defaultDom} />
//       </>
//     ),
//     breadcrumbRender: (routers = []) => {
//       if (routers.length === 1 && routers[0].path === HOME_PATH) return [...routers];
//       return [
//         {
//           path: HOME_PATH,
//           breadcrumbName: '首页',
//         },
//         ...routers,
//       ];
//     },
//     childrenRender: (children) => {
//       if (initialState?.loading) return <PageLoading />;
//       return (
//         <>

//         {children}
//           {/* <BaseTabs home={HOME_PATH} /> */}
//           {/* <SettingDrawer
//             disableUrlParams
//             enableDarkTheme
//             settings={initialState?.settings}
//             onSettingChange={(settings) => {
//               setInitialState((preInitialState) => ({
//                 ...preInitialState,
//                 settings,
//               }));
//             }}
//           /> */}
//         </>
//       );
//     },
//     ...initialState?.settings,
//   };
// };


/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

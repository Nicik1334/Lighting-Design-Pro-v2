import RightContent from '@/components/system/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { MenuDataItem, ProLayoutProps, SettingDrawer } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import React, { useEffect, useState } from 'react';
import Icon from '@ant-design/icons';
import * as antIcons from '@ant-design/icons';
import {
  Link,
  history,
  useModel,
  useAppData,
  useLocation,
  Navigate,
  useNavigate,
  Outlet,
} from '@umijs/max';
import GlobalConfig from '@/global';
import { HOME_PATH, LOGIN_PATH, TABS_LIST, USER_TOKEN } from '@/constants';
import NProgress from '@/components/common/NProgress';
import BaseTabs from '../BaseTabs';
import { TagsItemType } from '../BaseTabs/TabsMenu/data';

export const isDev = process.env.NODE_ENV === 'development';
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

const animateProps = {
  className: 'animate__animated animate__fadeInRight',
  style: {
    display: 'inline-block',
    animationDelay: '.2s',
    animationDuration: '.6s',
    animationDirection: 'revert-layer',
  },
};

const BasicLayout: React.FC<ProLayoutProps> = () => {
  const [pathname, setPathname] = useState(HOME_PATH);
  const { initialState, setInitialState } = useModel('@@initialState');
  const location = useLocation();
  const navigate = useNavigate();
  const route = useAppData().clientRoutes[useAppData().clientRoutes.length - 2].routes;

  useEffect(() => {
    if (location.pathname) {
      setPathname(location.pathname);
    } else {
      setPathname(HOME_PATH);
    }
  }, [location.pathname]);

  // console.log(initialState?.settings?.tabView);

  // 路径为"/",则重定向到首页
  // if (location.pathname === '/') return <Navigate to={HOME_PATH} />;

  const loopMenuItem = (menus: MenuDataItem[] = []): MenuDataItem[] | [] =>
    menus.map(({ icon, children, ...item }) => {
      return {
        ...item,
        icon: icon && <Icon component={antIcons[icon]} />,
        children: children && loopMenuItem(children),
      };
    });

  return (
    <ProLayout
      location={{ pathname }}
      route={{ routes: loopMenuItem(route as MenuDataItem[]) }}
      title={GlobalConfig.AppName}
      onMenuHeaderClick={() => navigate('/')}
      breadcrumbRender={(routers = []) => {
        if (routers.length === 1 && routers[0].linkPath === HOME_PATH) return null;
        return [
          {
            linkPath: HOME_PATH,
            breadcrumbName: '首页',
          },
          ...routers,
        ];
      }}
      itemRender={(route: any, _: any, routes: string | any[]) => {
        return routes.indexOf(route) === 0 ? (
          <Link to={route.linkPath} {...animateProps}>
            首页
          </Link>
        ) : (
          <span {...animateProps}>{route.breadcrumbName}</span>
        );
      }}
      menuItemRender={(item, dom) => {
        return item.isUrl ? (
          <a href={item.path} target="_blank" rel="noreferrer">
            {dom}
          </a>
        ) : (
          <a
            onClick={() => {
              if (location.pathname === item.path) return;
              const tabItem = (
                JSON.parse(sessionStorage.getItem(TABS_LIST) || '[]') as TagsItemType[]
              ).find((o) => o.path === item.path);
              if (tabItem) {
                const { hash, search } = tabItem.location as Location;
                navigate(`${item.path}${search}${hash}`);
              } else {
                navigate(item.path || '/');
              }
              setPathname(item.path || '/');
            }}
          >
            {dom}
          </a>
        );
      }}
      rightContentRender={() => <RightContent />}
      onPageChange={(pathname) => {
        NProgress.start();
        // if (
        //   pathname !== LOGIN_PATH &&
        //   (!sessionStorage.getItem(USER_TOKEN) || !initialState?.currentUser)
        // ) {
        //   history.replace(LOGIN_PATH); // 如果没有登录，重定向到 login
        // }
        setTimeout(() => NProgress.done(), 500);
      }}
      links={links}
      {...initialState?.settings}
    >
      <ConfigProvider>
        {initialState?.settings?.tabView ? <BaseTabs home={HOME_PATH} /> : <Outlet />}
        {!location.pathname.includes('/login') && (
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        )}
      </ConfigProvider>
    </ProLayout>
  );
};

export default BasicLayout;

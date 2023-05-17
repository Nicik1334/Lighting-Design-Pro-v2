import RightContent from '@/components/system/RightContent';
import { MenuDataItem, ProLayoutProps } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import React, { useEffect, useState } from 'react';
import Icon from '@ant-design/icons';
import * as antIcons from '@ant-design/icons';
import { Link, useModel, useAppData, useLocation, useNavigate, Outlet } from '@umijs/max';
import GlobalConfig from '@/global';
import { HOME_PATH, TABS_LIST } from '@/constants';
import NProgress from '@/components/common/NProgress';
import BaseTabs from '../BaseTabs';
import { TagsItemType } from '../BaseTabs/TabsMenu/data';

export const isDev = process.env.NODE_ENV === 'development';

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
  const { initialState } = useModel('@@initialState');
  const location = useLocation();
  const navigate = useNavigate();
  const route = useAppData().clientRoutes[useAppData().clientRoutes.length - 1].routes;

  useEffect(() => {
    if (location.pathname) {
      setPathname(location.pathname);
    } else {
      setPathname(HOME_PATH);
    }
  }, [location.pathname]);

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
      breadcrumbRender={(routers: string | any[]) => {
        if (routers.length === 1 && routers[0]?.linkPath === HOME_PATH) return null;
        return [
          {
            linkPath: HOME_PATH,
            breadcrumbName: '首页',
          },
          ...routers,
        ];
      }}
      itemRender={(route: any) => {
        return route.path === HOME_PATH ? (
          <Link to={route.path} {...animateProps}>
            首页
          </Link>
        ) : (
          <span {...animateProps}>{route.breadcrumbName}</span>
        );
      }}
      menuItemRender={(item: any, dom: React.ReactNode) => {
        if (item.isUrl)
          return (
            <a href={item.path} target="_blank" title={item.path} rel="noreferrer">
              {dom}
            </a>
          );
        return (
          <>
            {item.icon}
            <span />
            <a
              onClick={() => {
                if (location.pathname === item.path) return;
                const tabItem = (
                  JSON.parse(sessionStorage.getItem(TABS_LIST) || '[]') as TagsItemType[]
                ).find((o) => o.path === item.path);
                const search = (tabItem?.location?.search as Location) || '';
                search ? navigate(`${item.path}${search}`) : navigate(item.path || HOME_PATH);
                setPathname(item.path || HOME_PATH);
              }}
            >
              {item.name}
            </a>
          </>
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
      {...initialState?.settings}
    >
      <ConfigProvider>
        {initialState?.settings?.tabView ? <BaseTabs home={HOME_PATH} /> : <Outlet />}
      </ConfigProvider>
    </ProLayout>
  );
};

export default BasicLayout;

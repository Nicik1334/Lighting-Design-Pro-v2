import { HOME_PATH, LOGIN_PATH, NOT_PATH, TABS_LIST } from '@/constants';
import type { MenuDataItem } from '@umijs/route-utils';
import React, { createContext, memo, useEffect, useRef, useState, useContext } from 'react';
import { history, useLocation, useModel, useNavigate, useOutlet } from '@umijs/max';
import TabsMenu from './TabsMenu';
import type { TagsItemType } from './TabsMenu/data';
import { RouteContext, RouteContextType } from '@ant-design/pro-components';

interface BaseTabsProps {
  /**
   * 首页路由
   */
  home: string;
}

interface BaseTabsContextProps {
  /**
   * 关闭所有标签
   */
  handleCloseAll: () => void;
  /**
   * 关闭其他标签
   */
  handleCloseOther: () => void;
  /**
   * 关闭当前标签
   */
  handleClosePage: (
    tag?:
      | {
          path?: string;
        }
      | ((t: TagsItemType) => TagsItemType),
  ) => void;
  /**
   * 刷新选择的标签
   */
  handleRefreshPage: (
    tag?:
      | {
          path?: string;
        }
      | ((t: TagsItemType) => TagsItemType),
  ) => void | any;
}

export const BaseTabsContext = createContext<BaseTabsContextProps>({
  handleCloseAll: () => {},
  handleClosePage: () => {},
  handleCloseOther: () => {},
  handleRefreshPage: () => {},
});

let hasOpen = false; // 判断是否已打开过该页面
/**
 * @component BaseTabs 标签页组件
 */
const BaseTabs: React.FC<BaseTabsProps> = memo(({ home }) => {
  // const access = useAccess();
  const navigate = useNavigate();
  const location = useLocation();

  const element = useOutlet();
  const { initialState } = useModel('@@initialState');
  const [tabList, setTabList] = useState<TagsItemType[]>(() => {
    return JSON.parse(sessionStorage.getItem(TABS_LIST) || '[]');
  });
  const currPath = useRef<string>();
  const routeContext = useContext(RouteContext);

  const [cacheKeyMap, setCacheKeyMap] = useState<Record<string, any>>({});

  // 递归获取重定向路由
  const currentRoute = (
    path: string,
    list: MenuDataItem[],
    keyList: MenuDataItem[] = [],
  ): MenuDataItem[] => {
    list.forEach((node) => {
      if (node.children) currentRoute(path, node.children, keyList);
      if (node.path === path) keyList.push(node);
    });
    return keyList;
  };

  // 递归未设置权限的路由
  const notAccessRoutes = (list: MenuDataItem[], keyList: string[] = []) => {
    list.forEach((node) => {
      if (node.children) notAccessRoutes(node.children, keyList);
      if (!node.access && node.path) keyList.push(node.path);
    });
    return keyList;
  };

  // 缓存tag标签
  const setTagStorage = (list: TagsItemType[]) => {
    setTabList(list);
    if (initialState?.settings?.tabView && initialState?.settings?.tabView?.cacheTabView) {
      const tagsList = list.map((item) => {
        return {
          ...item,
          children: null,
          icon:
            typeof item.icon === 'string'
              ? item.icon
              : item.icon?.props.component.render.displayName || item.icon,
        };
      });
      sessionStorage.setItem(TABS_LIST, JSON.stringify(tagsList.filter((item) => item)));
    } else if (sessionStorage.getItem(TABS_LIST)) {
      sessionStorage.removeItem(TABS_LIST);
    }
  };

  // 关闭所有标签
  const handleCloseAll = () => {
    navigate(`${home}`);
    const tabItem = tabList.find((el) => el.path === home);
    const homeData = [];
    //判断路由栏是否有首页标签
    if (tabItem) {
      homeData.push({ ...tabItem, children: element, active: true, location });
    } else {
      const menuData = routeContext.menuData || [];
      const homeItem = currentRoute(home, menuData)[0];
      homeData.push({
        title: homeItem.name,
        path: home,
        children: element,
        active: true,
        location,
      });
    }
    setTagStorage(homeData);
  };

  // 关闭标签
  const handleClosePage = (tag: TagsItemType) => {
    // 如果剩余一个标签则关闭所有
    if (tabList.length <= 1) return handleCloseAll();
    const tagsList = [...tabList];
    // 判断关闭标签是否处于打开状态
    tagsList.find((el, i) => {
      if (el.path === tag.path && tag.active) {
        // 关闭当前路由后，跳转到左边，如果左边没路由则跳转到右边
        const next = tabList[i - 1] || tabList[i + 1];
        next.active = true;
        const search = (next?.location?.search as Location) || '';
        navigate(`${next.path}${search}`);
        return true;
      }
      return false;
    });
    const newList = tagsList.filter((el) => el.path !== tag.path);
    setTagStorage(newList);
  };

  // 关闭其他标签
  const handleCloseOther = () => {
    const tabItem = tabList.find((el) => el.active);
    if (tabItem) setTagStorage([tabItem]);
  };

  // 刷新选择的标签
  const handleRefreshPage = (tag: TagsItemType) => {
    const { path: pathname } = tag;
    const tagsList = tabList.map((item) => {
      if (item.path === tag.path) return { ...item, active: true };
      return { ...item, active: false };
    });
    setCacheKeyMap((key: any) => ({
      ...key,
      [pathname as string]: Math.random(),
    }));
    setTagStorage(tagsList);
  };

  // 校验并跳转到404
  const toAuth = () => {
    const { pathname } = location;
    if (pathname !== NOT_PATH) navigate(NOT_PATH);
    const newTabList = [...tabList].map((item) => ({ ...item, active: item.path === NOT_PATH }));
    // 判断当前tabList是否存在404路由，没有则push
    if (!newTabList.find((item) => item.path === NOT_PATH)) {
      newTabList.push({
        title: NOT_PATH,
        path: NOT_PATH,
        children: element,
        active: true,
      });
    }
    setTagStorage(newTabList);
  };

  // 监听路由改变 routeContext为当前路由信息
  const handleOnChange = (route: RouteContextType) => {
    const { menuData = [], currentMenu } = route;
    const { pathname } = location;

    const { path, redirectPath } = currentMenu as MenuDataItem;

    // (1)当前为登录页面则不进行初始化
    if (pathname === LOGIN_PATH) return;
    // (2)系统第一次初始化currentMenu默认为首页，判断currentMenu.path为首页且当前pathname不是首页则return
    if (path === HOME_PATH && path !== pathname) return;
    // (3)当前路由是否有效？，当前路由是否有权限？(routes未设置access则跳过)
    if (
      !path
      // ||
      // (!access.access({ path: pathname }) && !notAccessRoutes(menuData).includes(pathname))
    )
      return toAuth();
    // (4)有redirect则跳转重定向
    if (redirectPath) return history.replace(redirectPath); // 判断是否有重定向

    // 正常初始化跳转
    hasOpen = false;
    const tabNewList = tabList.map((item) => {
      if (path === item.path) {
        hasOpen = true;
        return {
          ...item,
          title: item.path === NOT_PATH ? item.path : item.title,
          active: true,
          location,
          children: element,
        };
      } else {
        return { ...item, active: false };
      }
    });

    if (!hasOpen) {
      tabNewList.push({
        title: pathname === NOT_PATH ? pathname : currentMenu?.name,
        path: pathname,
        children: element,
        active: true,
        icon: currentMenu?.icon,
        location,
      });
    }
    setTagStorage(tabNewList);
  };

  useEffect(() => {
    if (routeContext && currPath.current !== routeContext.currentMenu?.path) {
      currPath.current = routeContext.currentMenu?.path;
      handleOnChange(routeContext);
    }
  }, [routeContext]);

  return (
    <BaseTabsContext.Provider
      value={{
        handleCloseAll,
        handleCloseOther,
        handleClosePage: (close) => {
          const currentTag = tabList.find(
            (item) => item.path === location.pathname,
          ) as TagsItemType;
          handleClosePage(
            typeof close === 'function'
              ? close(currentTag)
              : close?.path
              ? (close as TagsItemType)
              : currentTag,
          );
        },
        handleRefreshPage: (refresh) => {
          const currentTag = tabList.find(
            (item) => item.path === location.pathname,
          ) as TagsItemType;
          handleRefreshPage(
            typeof refresh === 'function'
              ? refresh(currentTag)
              : refresh?.path
              ? (refresh as TagsItemType)
              : currentTag,
          );
        },
      }}
    >
      <TabsMenu
        {...{
          tabList,
          cacheKeyMap,
          closePage: handleClosePage,
          closeAllPage: handleCloseAll,
          closeOtherPage: handleCloseOther,
          refreshPage: handleRefreshPage,
        }}
      />
    </BaseTabsContext.Provider>
  );
});

export default BaseTabs;

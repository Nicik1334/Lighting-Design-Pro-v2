/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */

const routes = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BaseLayout',
    routes: [
      {
        path: '/',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: '首页',
        icon: 'CommentOutlined',
        component: './Welcome',
      },
      {
        path: '/admin',
        name: '管理页',
        icon: 'CrownOutlined',
        routes: [
          {
            path: '/admin',
            redirect: '/admin/sub-page',
          },
          {
            path: '/admin/sub-page',
            icon: 'TableOutlined',
            name: '操作页',
            component: './Admin',
          },
        ],
      },
      {
        icon: 'PicRightOutlined',
        name: '多级菜单',
        path: '/nested',
        routes: [
          {
            path: '/nested',
            redirect: '/nested/menu1/menu1-1',
          },
          {
            name: '菜单1',
            path: '/nested/menu1',
            routes: [
              {
                path: '/nested/menu1',
                redirect: '/nested/menu1/menu1-1',
              },
              {
                name: '菜单1-1',
                path: '/nested/menu1/menu1-1',
                component: './nested/menu1/menu1-1',
              },
              {
                name: '菜单1-2',
                path: '/nested/menu1/menu1-2',
                routes: [
                  {
                    path: '/nested/menu1/menu1-2',
                    redirect: '/nested/menu1/menu1-2/menu1-2-1',
                  },
                  {
                    name: '菜单1-2-1',
                    path: '/nested/menu1/menu1-2/menu1-2-1',
                    component: './nested/menu1/menu1-2/menu1-2-1',
                  },
                  {
                    name: '菜单1-2-2',
                    path: '/nested/menu1/menu1-2/menu1-2-2',
                    component: './nested/menu1/menu1-2/menu1-2-2',
                  },
                ],
              },
              {
                name: '菜单1-3',
                path: '/nested/menu1/menu1-3',
                component: './nested/menu1/menu1-3',
              },
            ],
          },
          {
            name: '菜单2',
            path: '/nested/menu2',
            component: './nested/menu2',
          },
        ],
      },
      {
        name: '百度',
        icon: 'RedditOutlined',
        path: 'http://www.baidu.com',
      },
      {
        path: '*',
        component: './404',
        // 不展示顶栏
        headerRender: false,
        // 不展示页脚
        footerRender: false,
        // 不展示菜单
        menuRender: false,
      },
    ],
  },
];

const onDealRoutes = (routes: any[]) => {
  routes.forEach((item) => {
    if (item.redirect) {
      item.redirectPath = item.redirect;
      delete item.redirect;
    }
    if (item.routes && item.routes.length > 0) onDealRoutes(item.routes);
  });
  return routes;
};

export default onDealRoutes(routes);

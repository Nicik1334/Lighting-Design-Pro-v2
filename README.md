## 预览地址: http://47.108.59.217:5555

## 1. 目录结构说明

项目文件需遵循项目目录结构说明进行创建，项目目录如图所示：

```
config  #umi配置
 |
public #静态资源
 │
src
 ├─assets #静态资源
 │  │
 │  ├─fonts #字体
 │  │
 │  ├─icons #图标
 │  │
 │  └─imgs #图片
 │
 ├─components #全局组件
 │  │
 │  ├─business #业务组件
 │  │
 │  └─common #公共组件
 │
 ├─constants #系统常量
 |      enum.ts 全局枚举常量
 │      index.ts 全局常量
 │
 ├─hooks #自定义hooks
 │      index.ts
 │
 ├─layouts #布局组件
 │      AuthLayout.tsx
 │      BasicLayout.tsx
 │
 ├─models #全局状态
 │      authModel.ts
 │
 ├─pages #路由组件
 |
 ├──xxx #业务组件
 |      components #私有组件目录(如果组件太多)
 |      index.tsx  # 默认的路由页面文件名
 │      service.ts #业务组件中单独使用的api接口文件(可选)
 |      model.ts #业务组件中单独使用的model文件(可选)
 |      type.d.ts #业务中需要对组件进行类型说明的文件(可选)
 ├─services #请求模块
 │      http.ts 封装请求函数
 │      public.ts 公共请求接口
 │
 ├─styles #style样式
 │      variables.less
 │
 ├─app.ts #运行时配置
 │
 ├─global.ts #全局ts
 │
 ├─global.less #全局less
 │
 ├─requestErrorConfig.ts #request错误配置
 │
 ├─loading.ts #路由跳转loading
 │
 ├─access.less #路由权限access
 │
 ├─typings.d.ts #全局ts声明文件
 │
 └─utils #工具方法
        index.ts

```

## 2. 文件夹以及文件的命名规范

> - 路由页面的文件夹名称以**小写**或者 **kebab-case** 方式进行命名。
> - 路由页面出口的组件名固定为 **index.tsx**。
> - 组件名称（不管是页面的组件还是公共组件或者是业务组件）以 **PascalCase (大驼峰)** 方式进行命名，**固定的 index.tsx(jsx) 除外**。
> - 如果页面路由拆分的组件太多，新建**components**文件夹。（如果拆分组件不多可直接平层以 **S-组件名.tsx**）。
> - 包含组件的文件夹都应 (大驼峰) 方式进行命名。
> - 页面中私有的组件的**文件夹名称**以 **S-组件名称** 方式进行命名。
> - 静态资源以小写或者下划线隔断方式进行命名。

## 3. 代码书写规范

> - 优先使用 `const` 其次`let` 不允许使用`var`。
> - 优先使用模板字符串拼接，不要使用 + 号拼接。
> - 不能进行嵌套三元表达式的判断。
> - 类名使用 PascalCase(大驼峰)方式进行定义,例如:PascalCase。
> - 函数名称使用驼峰命名方式进行命名,例如:abc,pascalCase。
> - 常量使用全大写方式进行命名,**PASCAL_CASE**。公共的枚举命名以 **PUBLIC_ENUM_XXXX**。
> - 函数名称和属性名称需要进行命名具有含义化，禁止 a,b,c 等随意命名。
> - 代码中避免使用魔法值 应当使用枚举映射。
> - 前端判断使用 === 进行判断。
> - 事件处理函数名称统一以<b style="background:#ff0000;">handle+具体名称</b>方式进行命名。
> - 请求统一以 **api+具体接口** 名称方式进行命名。
> - 请求方式统一使用 ahook 的 useRequest 钩子，取值以解构的方式进行命名，其中 run 方法以<b style="background:#ff0000;">run+具体名称</b>的方式进行命名。
> - 复杂页面需要将页面进行拆解为组件的方式进行组装。
> - 代码中存在大量的`type`或`interface`需要将 type 和 interface 单独写在 type.d.ts 中。
> - ts 文件中尽量减少使用 any。
> - 对于复杂的页面，状态多的页面，必须写好注释，尽量选择`/** XXX */`进行注释 。
> - 其他代码规范根据 eslint 等来管理。

## 4. 提交代码规范

- feat：增加新的业务功能
- fix：修复业务问题/BUG
- style： 样式的改动
- docs：文档和注释相关
- refactor：重构代码（即不是新增功能，也不是修改 bug 的代码变动）
- chore：构建过程或辅助工具插件的变动( 依赖包 )
- revert： 回退代码
- perf： 代码优化性能
- test：增加测试
- types：ts 类型定义文件更改

提交时遵循:git commit -m 'type: 功能模块-提交意见

```
git commit -m 'feat: 用户管理-添加用户'
git commit -m 'fix: 用户管理-修复用户无法新增'
git commit -m 'test: 用户管理-测试修改用户接口'
```

## 5. VSCode 配置规范

> - 安装 ESLint 插件
> - 安装 Prettier 插件
> - 安装 Stylelint 插件

## 6. ESLint 和 Prettier 和 Stylelint 规范

> - 遵循项目 umi 项目中的 eslint 和 prettier 配置文件进行校验

### 7. 前端开发流程

1. 理解需求
2. 查看原型
3. 组内讨论
4. 代码实现
5. 功能测试

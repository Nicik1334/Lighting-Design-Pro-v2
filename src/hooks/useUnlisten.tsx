import { history } from '@umijs/max';

/**
 * 自定义hook 用于获取当前路由locusPage信息,与机房信息
 * @param pathname 当前路由pathname
 * @returns
 */
function useUnlisten(pathname: string, callBack: (location: any) => void) {
  const unlisten = history.listen(async (location: any) => {
    if (location.pathname === pathname) {
      callBack(location);
    }
  });
  return unlisten;
}

export default useUnlisten;

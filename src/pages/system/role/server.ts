import { get, post } from '@/utils/http';

// 获取角色
export const getPageRole = (param: any) => post('/system/pageRole', param);

// 获取菜单路由
export const getTreeNode = (param: any) => get('/system/getCheckedRoleTreeNode', param);

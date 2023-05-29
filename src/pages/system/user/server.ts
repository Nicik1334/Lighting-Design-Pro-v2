import { get, post } from '@/utils/http';

// 获取当前的用户
export const getUserList = (param: any) => post('/system/getUserList', param);

// 获取组织部门
export const getOrgChildren = (param: any) => get('/system/getOrgChildren', param);

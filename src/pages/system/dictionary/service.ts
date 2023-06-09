import { get, post } from '@/utils/http';

// 获取字典列表
export const getdictList = (param: any) => post('/system/getdictList', param);

// 根据字典id查看详情列表
export const getDetailList = (param: any) => get('/system/getDetailList', param);

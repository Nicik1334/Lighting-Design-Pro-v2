import { get, post } from '@/utils/http';

export const login = (param: any) => post('login/account', param);

export const currentUser = (param: any) => get('login/currentUser', param);

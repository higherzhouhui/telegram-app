import service from '@/utils/request';

export const loginReq = (data: any) => {
  return service<any>({
    url: '/user/login',
    method: 'POST',
    data,
  });
};

export const updateUserReq = (data: any) => {
  return service<any>({
    url: '/user/update',
    method: 'POST',
    data,
  });
};
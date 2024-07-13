import service from '@/utils/request';

export const loginReq = (data: any) => {
  return service<any>({
    url: '/api/login',
    method: 'POST',
    data,
  });
};
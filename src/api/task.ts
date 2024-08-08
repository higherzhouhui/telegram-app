import service from '@/utils/request';

export const taskListReq = () => {
  return service<any>({
    url: '/task/list',
    method: 'GET',
  });
};

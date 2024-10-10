import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { addPending, removePending } from './pending';

// Handle the response
const handleResponse = (data: GlobalRequest.Response<any>) => {
  const { code } = data;
  if (code === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authorization');
      window.location.href = `/#/wallet`;
      // if (localStorage.getItem('h5PcRoot') == '1') {
      //   window.location.href = `/#/wallet`;
      // } else {
      //   window.location.href = `/`;
      // }
    }
  }
};
// Handle the error
const handleError = (res: any) => {
  if (!res) {
    return;
  }

};

// Create a request instance
const instance = axios.create({
  baseURL: '/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config: any) => {
    if (typeof window !== 'undefined') {
      const authorization = localStorage.getItem('authorization');
      if (authorization) {
        config.headers = {
          ...config.headers,
          'authorization': `Bearer ${authorization}`,
        };
      }
    }
    removePending(config);
    addPending(config);
      // Do something before sending the request
    return config;
  },
  (err) => {
      // Do something with the request error
    return Promise.reject(err);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const data: GlobalRequest.Response<any> = response.data;
      // Do something with the response data
    removePending(response);
    handleResponse(data);
    return response;
  },
  (err) => {
      // Do something with the response error
    handleError(err.response);
    console.error('httpError:', `${err}`)
    return Promise.reject(err);
  }
);

async function request<T>(config: AxiosRequestConfig) {
  return instance
    .request<GlobalRequest.Response<T>>(config)
    .then((res) => res.data);
}

export default request;

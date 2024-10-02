import axios, {AxiosRequestConfig} from 'axios';
export const pending: Map<any, any> = new Map();

/**
 * Add the request
 * @param config
 */
export const addPending = (config: AxiosRequestConfig) => {
  const url: string = [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');

  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel: any) => {
      if (!pending.has(url)) {
        pending.set(url, cancel);
      }
    });
};

/**
 * Remove the request
 * @param config
 */
export const removePending = (config: AxiosRequestConfig) => {
  const url: string = [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');
  if (pending.has(url)) {
    const cancel: (url: string) => void = pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};

/**
 * Clear the pending requests
 */
export const clearPending = () => {
  pending.forEach((url: string) => {
    const cancel: (url: string) => void = pending.get(url);
    cancel(url);
  });
  pending.clear();
};

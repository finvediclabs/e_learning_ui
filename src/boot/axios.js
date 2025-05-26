import { boot } from 'quasar/wrappers';
import axios from 'axios';
import qs from 'qs';
import { Dialog, Notify } from 'quasar';

let routerInstance = null; // Will be initialized later

const coreUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';

const api = axios.create({
  baseURL: coreUrl,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  },
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

const token = sessionStorage.getItem('authToken');
if (token) {
  setToken(token);
}

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.error || error.message;

  if (status === 401) {
  Dialog.create({
    title: 'Session Expired',
    message: errorMessage || 'You have been logged out. Please login again.',
    persistent: true,
    ok: {
      label: 'Login',
      color: 'primary'
    }
  }).onOk(() => {
    sessionStorage.clear();
    window.location.href = '/#/login'; // Direct browser redirect
  });

  return Promise.reject(new Error(errorMessage));
}


    return Promise.reject(error);
  }
);

// Boot file export
export default boot(({ app, router }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  routerInstance = router; // Store router instance for later use
});

export { api };

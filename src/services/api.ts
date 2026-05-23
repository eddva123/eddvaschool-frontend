import axios from 'axios';
<<<<<<< HEAD
import { getPortalLoginPath } from '../utils/tenantRedirect';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/v1',
=======

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
  withCredentials: true,
  timeout: 15000,
});

function getTenantDomainFromHostname(): string | null {
  const host = window.location.hostname.toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  if (host.endsWith('.localhost')) return host.replace(/\.localhost$/, '');
  const parts = host.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') return parts[0];
  return null;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const tenantDomain = getTenantDomainFromHostname();
  if (tenantDomain) {
<<<<<<< HEAD
    config.headers['x-tenant-subdomain'] = tenantDomain;
  }
  
  try {
    const institute = JSON.parse(localStorage.getItem('institute') || 'null');
    if (institute?.id) {
      config.headers['x-tenant-id'] = institute.id;
    }
  } catch (e) {}
=======
    config.headers['x-tenant-domain'] = tenantDomain;
  }
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('institute');
<<<<<<< HEAD
      const loginPath = getPortalLoginPath();
      if (window.location.pathname !== loginPath) {
        window.location.replace(loginPath);
=======
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
      }
    }
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Server took too long to respond.');
    }
    if (!error.response) {
      console.error('Network error. Backend may be offline.');
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // dev: Vite proxy; prod: Nginx
  withCredentials: true,     // set to true if you later switch to HttpOnly cookies
});

// Optional: small helper for bearer tokens (if you keep tokens in JS for now)
export const setBearer = (token?: string) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

// Always pull the latest token from storage before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Basic 401 cleanup
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("access_token");
      delete api.defaults.headers.common.Authorization;
    }
    return Promise.reject(err);
  }
);

export default api;

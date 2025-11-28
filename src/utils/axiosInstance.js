import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_API } from "../config";
import { clearAuth } from "./authHelpers"; 

const axiosInstance = axios.create({
  baseURL: BACKEND_API,
  timeout: 30_000,
});

/* ------------------------------------------------------
   Attach token automatically to every request
------------------------------------------------------ */
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};

        // don't overwrite if caller manually set Authorization header
        if (!config.headers.Authorization && !config.headers.authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------------------
   Global response interceptor:
   - auto logout on 401, 403, 404
   - handles deleted accounts
   - uses clearAuth()
------------------------------------------------------ */
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const status = err?.response?.status;
      const url = err?.config?.url || "";

      // If backend indicates user/token is invalid
      if ([401, 403, 404].includes(status)) {

        // Don't trigger logout on public auth endpoints, otherwise loops happen
        const isPublicAuthEndpoint = /\/loginsignup|\/signup|\/authverify|\/verify|\/resend-verification|\/forgot-password|\/logout/i.test(
          url
        );

        if (!isPublicAuthEndpoint) {
          clearAuth({
            redirect: true,
            toast: "Session expired or account removed. Please log in again.",
          });
        }
      }
    } catch (e) {
      // ignore
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;

// src/utils/axiosInstance.js
import axios from "axios";
import { BACKEND_API } from "../config";

const axiosInstance = axios.create({
  baseURL: BACKEND_API,
  // optional: set timeout
  timeout: 30_000,
});

// attach token automatically
axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      // ensure Bearer prefix
      config.headers = config.headers || {};
      if (!config.headers.Authorization && !config.headers.authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;

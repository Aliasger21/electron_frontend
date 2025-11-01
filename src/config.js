// Backend URL configuration used across the frontend.
// Set VITE_BACKEND_URL in Netlify (e.g. https://electronbackend.netlify.app) for production.
const backendBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL)
  ? import.meta.env.VITE_BACKEND_URL
  : 'http://localhost:8888';

export const BACKEND_BASE = backendBase;
export const BACKEND_API = `${backendBase}/.netlify/functions/index`;



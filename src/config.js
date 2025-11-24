// Backend URL configuration used across the frontend.
// Set VITE_BACKEND_URL in Netlify (e.g. https://electronbackend.netlify.app) for production.
// Prefer VITE_BACKEND_URL at build time. If that's not set (e.g. built without env vars),
// fall back at runtime to the production Netlify backend when running on a non-localhost host.
let backendBase;
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) {
  backendBase = import.meta.env.VITE_BACKEND_URL;
} else if (typeof window !== 'undefined' && window.location && window.location.hostname && !window.location.hostname.includes('localhost')) {
  // runtime fallback for deployed frontend built without VITE_BACKEND_URL
  backendBase = 'https://electronbackend.netlify.app';
} else {
  backendBase = 'http://localhost:8888';
}

export const BACKEND_BASE = backendBase;
export const BACKEND_API = `${backendBase}/.netlify/functions/index`;
// Default avatar used for new users who don't upload a profile picture.
export const DEFAULT_AVATAR_URL = '/default-avatar.svg';

// helpful runtime debug log (removed in future if noisy)
if (typeof window !== 'undefined') console.debug('[CONFIG] BACKEND_API =', BACKEND_API);



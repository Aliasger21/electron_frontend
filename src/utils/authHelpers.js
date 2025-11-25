// src/utils/authHelpers.js
import axiosInstance from "../utils/axiosInstance";

/**
 * Normalize user objects coming from various API shapes.
 */
export function normalizeUser(obj) {
  if (!obj || typeof obj !== "object") return null;
  return {
    _id: obj._id || obj.id || obj.userId,
    firstname:
      obj.firstname ||
      obj.firstName ||
      (typeof obj.name === "string" ? obj.name.split(" ")[0] : "") ||
      "",
    lastname: obj.lastname || obj.lastName || "",
    email: obj.email || obj.username || "",
    phone: obj.phone || obj.mobile || obj.contact || "",
    address: obj.address || obj.addr || obj.location || "",
    profilePic: obj.profilePic || obj.avatar || obj.picture || obj.profile || "",
    role: obj.role || obj.userRole || "user",
    ...obj,
  };
}

/**
 * Save user to localStorage and notify app.
 */
export function saveUserToLocal(u) {
  const normalized = normalizeUser(u);
  if (!normalized) return;
  localStorage.setItem("user", JSON.stringify(normalized));
  window.dispatchEvent(new Event("authChanged"));
}

/**
 * Store token in localStorage + axios headers.
 */
export function setToken(token) {
  if (!token) return;
  localStorage.setItem("token", token);
  try {
    axiosInstance.defaults.headers = axiosInstance.defaults.headers || {};
    axiosInstance.defaults.headers.common =
      axiosInstance.defaults.headers.common || {};
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch {}
}

/**
 * 🔥 Full secure logout:
 * - Clears token
 * - Clears user
 * - Clears cookies (if any)
 * - Dispatches authChanged so React updates immediately
 * - Optional toast
 * - Optional redirect
 */
export function clearAuth({
  redirect = true,
  toast = null, // string | null
} = {}) {
  try {
    localStorage.removeItem("token");
  } catch {}
  try {
    localStorage.removeItem("user");
  } catch {}

  // clear cookies (works if backend uses cookies for tokens)
  try {
    document.cookie.split(";").forEach((c) => {
      document.cookie =
        c.replace(/^ +/, "").replace(/=.*/, "") +
        "=;expires=" +
        new Date(0).toUTCString() +
        ";path=/";
    });
  } catch {}

  // broadcast logout to all components
  try {
    window.dispatchEvent(new Event("authChanged"));
  } catch {}

  // optional toast
  if (toast && window?.toast) {
    try {
      window.toast.info(toast);
    } catch {}
  }

  // redirect to login page after clearing
  if (redirect) {
    try {
      window.location.replace("/login");
    } catch {}
  }
}

// src/utils/authHelpers.js
import axiosInstance from "../utils/axiosInstance";

/**
 * Normalize various user shapes into a predictable object.
 */
export function normalizeUser(obj) {
  if (!obj || typeof obj !== "object") return null;
  return {
    _id: obj._id || obj.id || obj.userId || undefined,
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
 * Save normalized user to localStorage and notify app.
 */
export function saveUserToLocal(u) {
  const normalized = normalizeUser(u);
  if (!normalized) return;
  localStorage.setItem("user", JSON.stringify(normalized));
  // also ensure axiosInstance has Authorization header if token exists
  // (token handling separate; see setToken)
  window.dispatchEvent(new Event("authChanged"));
  // console.log("saveUserToLocal:", normalized);
}

/**
 * Set token in localStorage and axiosInstance default headers.
 */
export function setToken(token) {
  if (!token) return;
  localStorage.setItem("token", token);
  try {
    axiosInstance.defaults.headers = axiosInstance.defaults.headers || {};
    axiosInstance.defaults.headers.common = axiosInstance.defaults.headers.common || {};
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (err) {
    // ignore
  }
}

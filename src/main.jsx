// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import './styles/custom.css';
import './styles/design-tokens.css';
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.jsx";
import { CartProvider } from "./context/CartContext";
import { LoadingProvider } from './context/LoadingContext';

// ⭐ ADD THIS IMPORT
import ScrollToTop from "./components/ScrollToTop";

// keep axiosInstance import for repair flow
import axiosInstance from "./utils/axiosInstance";

/* -------------------------
   Safer dev-only localStorage guard
   - Runs only in development
   - Whitelists objects that look like a real user
   - Blocks only clearly suspicious writes
   - Uses Storage.prototype.setItem to avoid accidental overrides
   ------------------------- */
if (process.env.NODE_ENV === "development") {
  const __origSet = Storage.prototype.setItem.bind(localStorage);

  const looksLikeUser = (obj) => {
    if (!obj || typeof obj !== "object") return false;
    // Accept if it contains any common identifying fields
    if (
      obj._id ||
      obj.id ||
      obj.userId ||
      obj.email ||
      obj.firstname ||
      obj.firstName ||
      obj.name ||
      obj.profilePic ||
      obj.avatar
    ) {
      return true;
    }
    return false;
  };

  localStorage.setItem = function (key, value) {
    try {
      if (key === "user") {
        let parsed;
        try {
          parsed = JSON.parse(value);
        } catch {
          // If value is not JSON, write it as-is
          return __origSet(key, value);
        }

        // If it looks like a real user, allow it
        if (looksLikeUser(parsed)) {
          return __origSet(key, JSON.stringify(parsed));
        }

        // Only block clearly suspicious/minimal objects (avoid false positives)
        console.warn("Blocked suspicious localStorage.user write (dev-only):", parsed);
        return;
      }

      return __origSet(key, value);
    } catch (err) {
      // final fallback: call original setter
      return __origSet(key, value);
    }
  };
}

/* ---------- Autorepair user (robust, uses Storage.prototype.setItem) ---------- */
(async function tryRepairUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== "object") return;

    // If parsed object seems minimal, try to repair using token/authverify
    const isMinimal =
      (!parsed._id && !parsed.email && !parsed.firstname && !parsed.name && !parsed.profilePic);

    if (isMinimal) {
      const token = localStorage.getItem("token");
      if (token) {
        // ensure axiosInstance will attach Authorization for the repair request
        try {
          axiosInstance.defaults.headers = axiosInstance.defaults.headers || {};
          axiosInstance.defaults.headers.common = axiosInstance.defaults.headers.common || {};
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (e) {
          console.warn("Failed to set axios header during repair:", e);
        }

        try {
          const res = await axiosInstance.post("/authverify", {});
          const userProfile = res?.data?.data?.data || res?.data?.data || res?.data || null;
          if (userProfile && typeof userProfile === "object") {
            // Use Storage.prototype.setItem to avoid hitting any app-level override
            try {
              Storage.prototype.setItem.call(localStorage, "user", JSON.stringify(userProfile));
              window.dispatchEvent(new Event("authChanged"));
              console.info("Repaired localStorage.user from authverify.");
            } catch (innerErr) {
              console.warn("Repair: unable to write user to localStorage:", innerErr);
            }
          } else {
            console.warn("authverify returned no usable profile during repair:", res);
          }
        } catch (err) {
          console.warn("authverify failed during repair:", err);
        }
      }
    }
  } catch (err) {
    // swallow errors silently; repair is best-effort
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>

        {/* ⭐ FIXES THE FOOTER ISSUE */}
        <ScrollToTop behavior="auto" />

        <CartProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </CartProvider>

      </BrowserRouter>
    </Provider>
  </StrictMode>
);

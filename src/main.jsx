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

// src/main.jsx (paste near the top, after imports)
import axiosInstance from "./utils/axiosInstance";

/* ---------- Defensive guard: protect localStorage.user from minimal overwrites ---------- */
const __origLocalSet = localStorage.setItem.bind(localStorage);
const isMinimalUserObject = (obj) => {
  if (!obj || typeof obj !== "object") return true;
  const keys = Object.keys(obj);
  if ((obj.iat || obj.exp) && keys.length <= 3) return true;
  if (obj.email || obj.firstname) return false;
  return true;
};

localStorage.setItem = function (key, value) {
  try {
    if (key === "user") {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        return __origLocalSet(key, value);
      }
      if (isMinimalUserObject(parsed)) {
        console.warn("Blocked minimal localStorage.user write:", parsed);
        console.trace();
        return;
      }
      return __origLocalSet(key, JSON.stringify(parsed));
    }
    return __origLocalSet(key, value);
  } catch (err) {
    return __origLocalSet(key, value);
  }
};

/* ---------- Autorepair user ---------- */
(async function tryRepairUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed) return;

    if (isMinimalUserObject(parsed)) {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers = axiosInstance.defaults.headers || {};
        axiosInstance.defaults.headers.common = axiosInstance.defaults.headers.common || {};
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      try {
        const res = await axiosInstance.post("/authverify", {});
        const userProfile = res?.data?.data?.data || res?.data?.data || res?.data || null;
        if (userProfile && typeof userProfile === "object") {
          localStorage.setItem("user", JSON.stringify(userProfile));
          window.dispatchEvent(new Event("authChanged"));
          console.info("Repaired localStorage.user from authverify.");
        } else {
          console.warn("authverify returned no usable profile:", res);
        }
      } catch (err) {
        console.warn("authverify failed during repair:", err);
      }
    }
  } catch (err) {}
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

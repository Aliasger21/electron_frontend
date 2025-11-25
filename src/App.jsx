import React, { useEffect } from "react";
import AdminRoutes from "./routes/adminRoute";
import UserRoutes from "./routes/userRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./utils/axiosInstance";

/**
 * App root:
 * - verifies token on mount and on window focus
 * - when /authverify fails, axios interceptor will clear auth and redirect
 */
const App = () => {
  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        // best-effort verify; if this fails the axios interceptor will run and clear auth
        await axiosInstance.post("/authverify", {});
      } catch (err) {
        // interceptor already handles clearing + redirect in most cases.
        // As a fallback ensure we clear local storage and notify app.
        try { localStorage.removeItem("token"); } catch {}
        try { localStorage.removeItem("user"); } catch {}
        try { window.dispatchEvent(new Event("authChanged")); } catch {}
        // don't force another redirect here because interceptor likely already did it.
      }
    };

    verify();

    const onFocus = () => {
      // re-run verify when user returns to tab (useful if account deleted elsewhere)
      verify();
    };

    window.addEventListener("focus", onFocus);
    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <>
      <AdminRoutes />
      <UserRoutes />
      <ToastContainer position="top-right" />
    </>
  );
};

export default App;

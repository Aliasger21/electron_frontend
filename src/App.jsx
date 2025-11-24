import React, { useEffect, useState } from 'react'
import AdminRoutes from './routes/adminRoute'
import UserRoutes from "./routes/userRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ColorModeToggle = () => {
  // Default is dark (no data-theme set on body)
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined' && document.body.getAttribute('data-theme') === 'light') return 'light';
    if (prefersLight) return 'light';
    return 'dark';
  });
  useEffect(() => {
    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [theme]);
  return (
    <button
      type="button"
      onClick={() => setTheme((t) => t === 'light' ? 'dark' : 'light')}
      className="position-fixed end-0 top-0 m-3 ed-btn ed-btn--outline"
      style={{ zIndex: 9999 }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

const App = () => {
  return (
    <>
      <ColorModeToggle />
      <AdminRoutes />
      <UserRoutes />
      <ToastContainer position="top-right" />
    </>
  )
}

export default App

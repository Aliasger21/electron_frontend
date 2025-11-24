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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CartProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </CartProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetail from "../pages/user/ProductDetail";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
// OTP verification
import VerifyOTP from "../pages/user/VerifyOTP";
import VerifySuccess from "../pages/user/VerifySuccess";
import LegacyVerifyRedirect from "../pages/user/LegacyVerifyRedirect"; // <--- new
import Profile from "../pages/user/Profile";
import MyOrders from "../pages/user/MyOrders";

import ForgotPassword from "../pages/user/ForgotPassword";
import EnterResetOtp from "../pages/user/EnterResetOtp";
import NewPassword from "../pages/user/NewPassword";

import ShippingInfo from "../pages/other/ShippingInfo.jsx";
import ReturnsRefunds from "../pages/other/ReturnsRefunds.jsx";
import FAQ from "../pages/other/FAQ.jsx";
import PrivacyPolicy from "../pages/other/PrivacyPolicy.jsx";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* OTP verification route (used now) */}
        <Route path="verifyOTP" element={<VerifyOTP />} />

        {/* Legacy token-link route (keeps old email links working).
            It will try to verify token if provided, otherwise redirect to OTP flow. */}
        <Route path="verify" element={<LegacyVerifyRedirect />} />

        <Route path="verify-success" element={<VerifySuccess />} />

        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="enter-reset-otp" element={<EnterResetOtp />} />
        <Route path="reset-password" element={<NewPassword />} />

        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<MyOrders />} />

        <Route path="shipping-info" element={<ShippingInfo />} />
        <Route path="returns-refunds" element={<ReturnsRefunds />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;

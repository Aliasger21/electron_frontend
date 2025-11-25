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
// NOTE: Using the new VerifyOTP component (OTP-based verification & auto-login)
import VerifyOTP from "../pages/user/VerifyOTP";
import VerifySuccess from "../pages/user/VerifySuccess";
import Profile from "../pages/user/Profile";
import MyOrders from "../pages/user/MyOrders";

// New pages for forgot/reset flow
import ForgotPassword from "../pages/user/ForgotPassword";
import EnterResetOtp from "../pages/user/EnterResetOtp";
import NewPassword from "../pages/user/NewPassword";

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

                {/* Verification (OTP) route — replaced token link with OTP verification */}
                <Route path="verify" element={<VerifyOTP />} />
                <Route path="verify-success" element={<VerifySuccess />} />

                {/* Forgot / Reset password flow (email-OTP) */}
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="enter-reset-otp" element={<EnterResetOtp />} />
                <Route path="reset-password" element={<NewPassword />} />

                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<MyOrders />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;

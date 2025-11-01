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
import Verify from "../pages/user/Verify";
import VerifySuccess from "../pages/user/VerifySuccess";
import Profile from "../pages/user/Profile";
import MyOrders from "../pages/user/MyOrders";

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
                <Route path="verify" element={<Verify />} />
                <Route path="verify-success" element={<VerifySuccess />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<MyOrders />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;

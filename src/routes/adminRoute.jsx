import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/adminDashboard";
import ProductsPage from "../pages/admin/adminProducts";
import UploadProductPage from "../pages/admin/adminUpload";
import UsersPage from "../pages/admin/adminUsers";
import OrdersPage from "../pages/admin/adminOrders";
import LogoutPage from "../pages/admin/adminLogout";

const AdminRoute = () => {
    return (
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="upload" element={<UploadProductPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="logout" element={<LogoutPage />} />
            </Route>
        </Routes>
    );
};

export default AdminRoute;

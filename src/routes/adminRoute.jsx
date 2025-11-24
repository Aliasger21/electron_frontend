import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/adminDashboard";
import ProductsPage from "../pages/admin/adminProducts";
import UploadProductPage from "../pages/admin/adminUpload";
import UsersPage from "../pages/admin/adminUsers";
import OrdersPage from "../pages/admin/adminOrders";
import LogoutPage from "../pages/admin/adminLogout";

// ====================================================
// 🔒 ProtectedAdmin Wrapper (Frontend Route Protection)
// ====================================================
const ProtectedAdmin = ({ children }) => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!rawUser || !token) {
        return <Navigate to="/" replace />;
    }

    let userObj;
    try {
        userObj = JSON.parse(rawUser);
    } catch {
        return <Navigate to="/" replace />;
    }

    if (userObj.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

// ====================================================
// 🔥 Admin Route System (Fully Protected)
// ====================================================
const AdminRoute = () => {
    return (
        <Routes>
            <Route
                path="/admin"
                element={
                    <ProtectedAdmin>
                        <AdminLayout />
                    </ProtectedAdmin>
                }
            >
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

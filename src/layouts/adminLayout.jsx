import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "../components/admin/adminHeader";
import AdminSidebar from "../components/admin/adminSidebar";
import "./admin.css";

// =========================
// 🔒 ADMIN PROTECTION ADDED
// =========================
export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!rawUser || !token) {
            navigate("/"); // not logged in at all
            return;
        }

        let userObj;
        try {
            userObj = JSON.parse(rawUser);
        } catch {
            navigate("/");
            return;
        }

        if (userObj.role !== "admin") {
            navigate("/"); // logged in but not admin
        }
    }, [navigate]);

    const getPageTitle = () => {
        const path = location.pathname.split("/").filter(Boolean);
        if (path.length === 1) return "Dashboard";
        return path[path.length - 1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // FULL ORIGINAL LAYOUT BELOW — UNTOUCHED
    return (
        <>
            <AdminHeader />

            <div className="d-flex">
                <div className="admin-sidebar">
                    <h4>Admin Panel</h4>
                    <nav className="nav flex-column">
                        <NavLink to="/admin" end className="nav-link">Dashboard</NavLink>
                        <NavLink to="/admin/products" className="nav-link">Products</NavLink>
                        <NavLink to="/admin/upload" className="nav-link">Upload Product</NavLink>
                        <NavLink to="/admin/users" className="nav-link">Users</NavLink>
                        <NavLink to="/admin/orders" className="nav-link">Orders</NavLink>
                        <NavLink to="/admin/logout" className="nav-link">Logout</NavLink>
                    </nav>
                </div>

                <div className="flex-grow-1" style={{ backgroundColor: "var(--bg-dark)", minHeight: "100vh" }}>
                    <header>
                        <h2>{getPageTitle()}</h2>
                        <span>Welcome, Admin!</span>
                    </header>

                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}

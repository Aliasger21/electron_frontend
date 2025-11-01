import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import AdminHeader from "../components/admin/adminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import "./admin.css"; // ensure your theme file is imported (path as needed)

export default function AdminLayout() {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname.split("/").filter(Boolean);
        if (path.length === 1) return "Dashboard";
        return path[path.length - 1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    };

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

                <div className="flex-grow-1">
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

import React from "react";
import { NavLink } from "react-router-dom";
import { House, Boxes, Users } from "lucide-react";

const links = [
    { to: "/admin", label: "Dashboard", Icon: House },
    { to: "/admin/products", label: "Products", Icon: Boxes },
    { to: "/admin/users", label: "Users", Icon: Users },
];

const AdminSidebar = () => {
    return (
        <div className="d-flex flex-column sidebar-container">
            <h4 className="fw-bold mb-4 text-accent">Admin Panel</h4>

            {links.map(({ to, label, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
                    }
                >
                    <Icon size={18} />
                    {label}
                </NavLink>
            ))}
        </div>
    );
};

export default AdminSidebar;

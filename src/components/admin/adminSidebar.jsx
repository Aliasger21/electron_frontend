import React from "react";
import { NavLink } from "react-router-dom";
import { House, Boxes, Users } from "lucide-react";

const AdminSidebar = () => {
    const links = [
        { to: "/admin", label: "Dashboard", icon: <House size={18} /> },
        { to: "/admin/products", label: "Products", icon: <Boxes size={18} /> },
        { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
    ];

    return (
        <div className="d-flex flex-column sidebar-container">
            <h4 className="fw-bold mb-4" style={{ color: "var(--accent)" }}>Admin Panel</h4>
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""} d-flex align-items-center gap-2`
                    }
                >
                    {link.icon} {link.label}
                </NavLink>
            ))}
        </div>
    );
};

export default AdminSidebar;

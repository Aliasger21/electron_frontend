import React, { useMemo, useState } from "react";
import { Navbar, Button, Offcanvas, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/upload", label: "Upload Product" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/orders", label: "Orders" },
];

export default function AdminHeader() {
    const [show, setShow] = useState(false);
    const location = useLocation();

    const isAdmin = useMemo(() => {
        const stored = localStorage.getItem("user");
        if (!stored) return false;
        try {
            const u = JSON.parse(stored);
            return u && u.role === "admin";
        } catch {
            return false;
        }
    }, []);

    const close = () => setShow(false);
    const open = () => setShow(true);

    const isActive = (path) => {
        // treat parent route as active for nested routes (e.g. /admin/products/123)
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <>
            <Navbar className="mobile-admin-header" expand={false}>
                <Container fluid>
                    <Row className="w-100 align-items-center">
                        <Col xs={10} className="d-flex justify-content-start">
                            <div className="mobile-title">Admin Panel</div>
                        </Col>
                        <Col xs={2} className="d-flex justify-content-end">
                            <Button
                                variant="outline-light"
                                className="menu-btn"
                                aria-label="Open admin menu"
                                onClick={open}
                            >
                                ☰
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Navbar>

            <Offcanvas show={show} onHide={close} placement="start" className="admin-offcanvas">
                <Offcanvas.Header>
                    <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
                    <Button
                        variant="outline-light"
                        className="close-btn"
                        aria-label="Close menu"
                        onClick={close}
                    >
                        ×
                    </Button>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    {isAdmin ? (
                        NAV_ITEMS.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                                onClick={close}
                            >
                                {item.label}
                            </Link>
                        ))
                    ) : (
                        <Link to="/admin/logout" className="nav-link" onClick={close}>
                            Logout
                        </Link>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

import React, { useState } from "react";
import { Navbar, Button, Offcanvas, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function AdminHeader() {
    const [show, setShow] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: "/admin", label: "Dashboard" },
        { path: "/admin/products", label: "Products" },
        { path: "/admin/upload", label: "Upload Product" },
        { path: "/admin/users", label: "Users" },
        { path: "/admin/orders", label: "Orders" },
        { path: "/admin/logout", label: "Logout" },
    ];

    return (
        <>
            {/* Mobile Navbar */}
            <Navbar className="mobile-admin-header" expand={false}>
                <Container fluid>
                    <Row className="w-100 align-items-center">
                        {/* Title (10 columns) */}
                        <Col xs={10} className="d-flex justify-content-start">
                            <div className="mobile-title">Admin Panel</div>
                        </Col>

                        {/* Menu button (2 columns) */}
                        <Col xs={2} className="d-flex justify-content-end">
                            <Button
                                variant="outline-light"
                                className="menu-btn"
                                aria-label="Open menu"
                                onClick={() => setShow(true)}
                            >
                                ☰
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Navbar>

            {/* Offcanvas */}
            <Offcanvas
                show={show}
                onHide={() => setShow(false)}
                placement="start"
                className="admin-offcanvas"
                backdropClassName="admin-offcanvas-backdrop"
            >
                <Offcanvas.Header className="offcanvas-header">
                    <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
                    <Button
                        variant="outline-light"
                        className="close-btn"
                        aria-label="Close menu"
                        onClick={() => setShow(false)}
                    >
                        ×
                    </Button>
                </Offcanvas.Header>

                <Offcanvas.Body className="offcanvas-body">
                    {navItems.map((it) => (
                        <Link
                            key={it.path}
                            to={it.path}
                            className={`nav-link ${location.pathname === it.path ? "active" : ""}`}
                            onClick={() => setShow(false)}
                        >
                            {it.label}
                        </Link>
                    ))}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

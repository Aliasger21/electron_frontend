import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleNewsletter = (e) => {
        e.preventDefault();
        alert(`Thanks for subscribing! We'll send deals to ${email}`);
        setEmail("");
    };

    return (
        <footer
            style={{
                backgroundColor: "var(--bg-card)",
                borderTop: "1px solid var(--border)",
                color: "var(--text-muted)",
                paddingTop: "40px",
                paddingBottom: "20px",
            }}
        >
            <Container>
                {/* Newsletter Section */}
                <Row className="mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                    <Col md={12}>
                        <div className="text-center">
                            <h5 style={{ color: "#ffffff", marginBottom: "10px", fontWeight: "600" }}>
                                📧 Subscribe to Our Newsletter
                            </h5>
                            <p style={{ color: "var(--text-muted)", marginBottom: "20px", fontSize: "0.9rem" }}>
                                Get exclusive deals, new product alerts, and special offers delivered to your inbox!
                            </p>
                            <Form 
                                onSubmit={handleNewsletter} 
                                className="d-flex justify-content-center gap-2 flex-wrap"
                            >
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        maxWidth: "300px",
                                        backgroundColor: "var(--bg-dark)",
                                        border: "1px solid var(--border)",
                                        color: "#ffffff",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Button
                                    type="submit"
                                    style={{
                                        backgroundColor: "var(--accent)",
                                        border: "none",
                                        color: "#ffffff",
                                        borderRadius: "8px",
                                        paddingLeft: "25px",
                                        paddingRight: "25px",
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>

                {/* Footer Links & Info */}
                <Row className="justify-content-center">
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-4 mb-md-4 mb-lg-0 text-center">
                        <h6 style={{ color: "#ffffff", marginBottom: "15px", fontWeight: "600" }}>
                            Quick Links
                        </h6>
                        <div 
                            className="d-flex flex-column align-items-center"
                            style={{ gap: "8px" }}
                        >
                            <a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                Home
                            </a>
                            <a href="/products" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                Products
                            </a>
                            <a href="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                About Us
                            </a>
                            <a href="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                Contact
                            </a>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-4 mb-md-4 mb-lg-0 text-center">
                        <h6 style={{ color: "#ffffff", marginBottom: "15px", fontWeight: "600" }}>
                            Customer Service
                        </h6>
                        <div 
                            className="d-flex flex-column align-items-center"
                            style={{ gap: "8px" }}
                        >
                            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                Shipping Info
                            </a>
                            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                Returns & Refunds
                            </a>
                            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                FAQs
                            </a>
                            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                                Privacy Policy
                            </a>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3} className="text-center">
                        <h6 style={{ color: "#ffffff", marginBottom: "15px", fontWeight: "600" }}>
                            Contact Us
                        </h6>
                        <div 
                            className="d-flex flex-column align-items-center"
                            style={{ gap: "8px" }}
                        >
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
                                📧 support@electron.store
                            </p>
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
                                📞 +91 123 456 7890
                            </p>
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
                                🕒 Mon-Sat: 9AM - 6PM
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Copyright */}
                <Row className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <Col md={12} className="text-center">
                        <p className="mb-1" style={{ color: "var(--text-muted)" }}>
                            &copy; {new Date().getFullYear()}{" "}
                            <span style={{ color: "var(--accent)", fontWeight: "600" }}>
                                Electron
                            </span>
                            <span style={{ color: "#ffffff", fontWeight: "600" }}>
                                .store
                            </span>
                            . All rights reserved.
                        </p>
                        <p className="small mb-0" style={{ color: "var(--text-muted)" }}>
                            Powered by React ⚡ & Node.js
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;

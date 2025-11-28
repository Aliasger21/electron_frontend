import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) { toast.info("Please enter a valid email"); return; }
    toast.success(`Thanks for subscribing — deals will be sent to ${email}`);
    setEmail("");
  };

  return (
    <footer style={{ backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--border)", color: "var(--text-muted)", paddingTop: 40, paddingBottom: 20 }}>
      <Container>
        <Row className="mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <Col md={12} className="text-center">
            <h5 style={{ color: "#fff", marginBottom: 10, fontWeight: 600 }}>📧 Subscribe to Our Newsletter</h5>
            <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>Get exclusive deals, new product alerts, and special offers delivered to your inbox!</p>
            <Form onSubmit={handleNewsletter} className="d-flex justify-content-center gap-2 flex-wrap">
              <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ maxWidth: 300, backgroundColor: "var(--bg-dark)", border: "1px solid var(--border)", color: "#fff", borderRadius: 8 }} />
              <Button type="submit" style={{ backgroundColor: "var(--accent)", border: "none", color: "#fff", borderRadius: 8, paddingLeft: 25, paddingRight: 25 }}>Subscribe</Button>
            </Form>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4 text-center">
            <h6 style={{ color: "#fff", marginBottom: 15, fontWeight: 600 }}>Quick Links</h6>
            <div className="d-flex flex-column align-items-center" style={{ gap: 8 }}>
              <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
              <Link to="/products" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Products</Link>
              <Link to="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }}>About Us</Link>
              <Link to="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Contact</Link>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={3} className="mb-4 text-center">
            <h6 style={{ color: "#fff", marginBottom: 15, fontWeight: 600 }}>Customer Service</h6>
            <div className="d-flex flex-column align-items-center" style={{ gap: 8 }}>
              <Link to="/shipping-info" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Shipping Info</Link>
              <Link to="/returns-refunds" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Returns & Refunds</Link>
              <Link to="/faq" style={{ color: "var(--text-muted)", textDecoration: "none" }}>FAQs</Link>
              <Link to="/privacy-policy" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={3} className="text-center">
            <h6 style={{ color: "#fff", marginBottom: 15, fontWeight: 600 }}>Contact Us</h6>
            <div className="d-flex flex-column align-items-center" style={{ gap: 8 }}>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>📧 support@electron.store</p>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>📞 +91 123 456 7890</p>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>🕒 Mon-Sat: 9AM - 6PM</p>
            </div>
          </Col>
        </Row>

        <Row className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <Col md={12} className="text-center">
            <p className="mb-1" style={{ color: "var(--text-muted)" }}>
              &copy; {new Date().getFullYear()} <span style={{ color: "var(--accent)", fontWeight: 600 }}>Electron</span><span style={{ color: "#fff", fontWeight: 600 }}>.store</span>. All rights reserved.
            </p>
            <p className="small mb-0" style={{ color: "var(--text-muted)" }}>Powered by React ⚡ & Node.js</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

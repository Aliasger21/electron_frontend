// src/pages/other/PrivacyPolicy.jsx
import { Container } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <div
        style={{
          background: "var(--bg-card)",
          padding: 24,
          borderRadius: 8,
          color: "var(--text)",
        }}
      >
        <h2 className="mb-3" style={{ color: "#fff" }}>🔐 Privacy Policy</h2>

        <p style={{ color: "var(--text-muted)" }}>
          We value your privacy. This document explains how we collect and use your data.
        </p>

        <h5 style={{ color: "#fff", marginTop: 20 }}>📘 Information We Collect</h5>
        <ul style={{ color: "var(--text-muted)" }}>
          <li>Name, email, and contact details</li>
          <li>Order and transaction details</li>
          <li>Browser & device information for analytics</li>
        </ul>

        <h5 style={{ color: "#fff", marginTop: 20 }}>🔎 How We Use Your Data</h5>
        <ul style={{ color: "var(--text-muted)" }}>
          <li>To process orders and notify you about delivery</li>
          <li>To send promotional content (only if subscribed)</li>
          <li>To improve user experience and website features</li>
        </ul>

        <h5 style={{ color: "#fff", marginTop: 20 }}>🛡️ Data Security</h5>
        <p style={{ color: "var(--text-muted)" }}>
          We use encrypted connections and secure servers to protect your data.
        </p>

        <h5 style={{ color: "#fff", marginTop: 20 }}>📝 Your Rights</h5>
        <ul style={{ color: "var(--text-muted)" }}>
          <li>Access your data anytime</li>
          <li>Request deletion of your account</li>
          <li>Opt-out of marketing emails</li>
        </ul>
      </div>
    </Container>
  );
};

export default PrivacyPolicy;

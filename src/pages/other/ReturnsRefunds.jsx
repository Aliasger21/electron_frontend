// src/pages/other/ReturnsRefunds.jsx
import { Container } from "react-bootstrap";

const ReturnsRefunds = () => {
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
        <h2 style={{ color: "#fff" }}>🔄 Returns & Refunds</h2>
        <p style={{ color: "var(--text-muted)" }}>
          We want you to be completely satisfied with your purchase. Here's how returns work:
        </p>

        <h5 style={{ color: "#fff", marginTop: 20 }}>📅 Return Window</h5>
        <p style={{ color: "var(--text-muted)" }}>You can return products within 7 days of delivery.</p>

        <h5 style={{ color: "#fff", marginTop: 20 }}>📦 Eligibility</h5>
        <ul style={{ color: "var(--text-muted)" }}>
          <li>Product must be unused and in original packaging.</li>
          <li>Damaged/defective products are eligible for free pickup.</li>
          <li>Opened headphones/earphones are **not returnable** due to hygiene reasons.</li>
        </ul>

        <h5 style={{ color: "#fff", marginTop: 20 }}>💸 Refund Process</h5>
        <p style={{ color: "var(--text-muted)" }}>
          Refunds are initiated within 2–5 days after inspection. Amount is credited to the original payment method.
        </p>
      </div>
    </Container>
  );
};

export default ReturnsRefunds;

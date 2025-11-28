import { Container } from "react-bootstrap";

const ShippingInfo = () => {
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
        <h2 className="mb-3" style={{ color: "#fff" }}>🚚 Shipping Information</h2>

        <p style={{ color: "var(--text-muted)" }}>
          We aim to deliver your products safely and quickly. Below are our shipping policies:
        </p>

        <h5 style={{ color: "#fff", marginTop: 20 }}>📦 Delivery Time</h5>
        <ul style={{ color: "var(--text-muted)" }}>
          <li>Standard Delivery: 3–6 business days</li>
          <li>Express Delivery: 1–2 business days (Available in select cities)</li>
          <li>International Shipping: 7–14 business days</li>
        </ul>

        <h5 style={{ color: "#fff", marginTop: 20 }}>🚀 Order Processing</h5>
        <p style={{ color: "var(--text-muted)" }}>
          Orders are processed within 24 hours. You will receive a tracking link via email once dispatched.
        </p>

        <h5 style={{ color: "#fff", marginTop: 20 }}>💰 Shipping Charges</h5>
        <p style={{ color: "var(--text-muted)" }}>
          Shipping charges depend on location and weight. Exact charges are shown at checkout.
        </p>
      </div>
    </Container>
  );
};

export default ShippingInfo;

// src/pages/other/FAQ.jsx
import { Container } from "react-bootstrap";

const FAQ = () => {
  const items = [
    { q: "When will my order arrive?", a: "Most orders arrive in 3–6 business days depending on your location." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled before they are shipped." },
    { q: "What payment methods do you accept?", a: "We accept UPI, Credit/Debit Cards, Netbanking & Wallets." },
    { q: "Do products come with warranty?", a: "Yes, most products offer 6–12 months manufacturer warranty." },
  ];

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
        <h2 className="mb-3" style={{ color: "#fff" }}>❓ Frequently Asked Questions</h2>
        {items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <h5 style={{ color: "#fff" }}>{item.q}</h5>
            <p style={{ color: "var(--text-muted)" }}>{item.a}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FAQ;

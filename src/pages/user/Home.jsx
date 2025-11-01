import { Container, Row, Col, Button } from "react-bootstrap";

const Home = () => {
    const cardStyle = {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        transition: "all 0.3s ease",
        cursor: "pointer",
    };

    const cardHover = {
        transform: "translateY(-6px)",
        borderColor: "var(--accent)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    };

    return (
        <Container className="text-center py-5">
            <Row className="align-items-center">
                <Col md={12} className="my-4">
                    <h1 className="fw-bold display-5 mb-3">
                        Welcome to{" "}
                        <span style={{ color: "var(--accent)" }}>Electron.store</span>
                    </h1>
                    <p className="text-muted mb-4 fs-5">
                        Your one-stop shop for mobiles, earphones, smartwatches, and all
                        electronic accessories — at unbeatable prices.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        className="px-4 py-2 fw-semibold"
                        style={{
                            borderRadius: "12px",
                            backgroundColor: "var(--accent)",
                            border: "none",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        }}
                    >
                        Shop Now
                    </Button>
                </Col>
            </Row>

            <Row className="mt-5">
                {[
                    {
                        title: "🔥 Latest Devices",
                        desc: "Explore the newest phones and smart tech in the market.",
                    },
                    {
                        title: "🎧 Premium Audio",
                        desc: "Experience crystal-clear sound with our best-rated earphones.",
                    },
                    {
                        title: "💻 Accessories",
                        desc: "Enhance your setup with high-quality chargers, cables, and more.",
                    },
                ].map((item, idx) => (
                    <Col md={4} className="mb-4" key={idx}>
                        <div
                            className="p-4 text-start card-hover"
                            style={cardStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                            onMouseLeave={(e) =>
                                Object.assign(e.currentTarget.style, cardStyle)
                            }
                        >
                            <h5>{item.title}</h5>
                            <p className="text-muted">{item.desc}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;

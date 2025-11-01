import { Container, Row, Col, Button, Card, Badge, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const cardStyle = {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        transform: "translateY(0)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    };

    const cardHover = {
        transform: "translateY(-6px)",
        borderColor: "var(--accent)",
        boxShadow: "0 4px 20px rgba(0, 180, 216, 0.3)",
    };

    const categories = [
        { name: "Mobiles", icon: "📱", path: "/products?category=mobiles" },
        { name: "Laptops", icon: "💻", path: "/products?category=laptops" },
        { name: "Airbuds", icon: "🎧", path: "/products?category=airbuds" },
        { name: "Earphones", icon: "🎵", path: "/products?category=earphones" },
        { name: "Smartwatches", icon: "⌚", path: "/products?category=smartwatches" },
        { name: "Accessories", icon: "🔌", path: "/products?category=accessories" },
        { name: "Tablets", icon: "📱", path: "/products?category=tablets" },
        { name: "Gaming", icon: "🎮", path: "/products?category=gaming consoles" },
    ];

    const stats = [
        { number: "10K+", label: "Happy Customers" },
        { number: "500+", label: "Products" },
        { number: "24/7", label: "Support" },
        { number: "Free", label: "Shipping" },
    ];

    const benefits = [
        { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
        { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
        { icon: "✓", title: "Genuine Products", desc: "100% authentic items" },
        { icon: "🔒", title: "Secure Payments", desc: "Safe & encrypted" },
    ];

    const testimonials = [
        {
            name: "Rajesh Kumar",
            rating: 5,
            text: "Amazing quality products at great prices! Fast delivery too.",
        },
        {
            name: "Priya Sharma",
            rating: 5,
            text: "Best place to buy electronics. Genuine products only!",
        },
        {
            name: "Amit Patel",
            rating: 5,
            text: "Excellent customer service. Highly recommended!",
        },
        {
            name: "Sneha Reddy",
            rating: 5,
            text: "Love the variety and competitive pricing. Will shop again!",
        },
    ];

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await axios.get(`${BACKEND_API}/products`);
                const fetched = res.data.products || [];

                // Get one product from each category
                const featuredProducts = [];
                const categoryMap = new Map();

                // Map category variations (handle case-insensitive matching)
                const categoryVariations = {
                    "mobiles": "mobiles",
                    "laptops": "laptops",
                    "airbuds": "airbuds",
                    "earphones": "earphones",
                    "smartwatches": "smartwatches",
                    "accessories": "accessories",
                    "tablets": "tablets",
                    "gaming consoles": "gaming consoles",
                    "gaming": "gaming consoles"
                };

                // Group products by category (case-insensitive)
                fetched.forEach(product => {
                    if (product.category) {
                        const categoryKey = product.category.toLowerCase();
                        const normalizedCategory = categoryVariations[categoryKey] || categoryKey;

                        if (!categoryMap.has(normalizedCategory)) {
                            categoryMap.set(normalizedCategory, product);
                        }
                    }
                });

                // Select one product from each available category
                categories.forEach(category => {
                    const categoryKey = category.path.split("category=")[1]?.toLowerCase();
                    if (categoryMap.has(categoryKey)) {
                        featuredProducts.push(categoryMap.get(categoryKey));
                    }
                });

                // If we don't have enough products from categories, add more from fetched
                if (featuredProducts.length < 8 && fetched.length > featuredProducts.length) {
                    const remaining = fetched.filter(p =>
                        !featuredProducts.some(fp => fp._id === p._id)
                    );
                    featuredProducts.push(...remaining.slice(0, 8 - featuredProducts.length));
                }

                setProducts(featuredProducts);
            } catch (err) {
                console.error("❌ Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);


    return (
        <Container className="py-5">
            {/* Hero Section */}
            <Row className="align-items-center text-center mb-5">
                <Col md={12} className="my-4">
                    <h1 className="fw-bold display-5 mb-3" style={{ color: "#ffffff" }}>
                        Welcome to{" "}
                        <span style={{ color: "var(--accent)" }}>Electron</span>
                        <span style={{ color: "#ffffff" }}>.store</span>
                    </h1>
                    <p
                        className="mb-4 fs-5"
                        style={{ color: "var(--text-muted)" }}
                    >
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
                            boxShadow: "0 4px 15px rgba(0, 180, 216, 0.4)",
                            color: "#ffffff",
                        }}
                        as={Link}
                        to="/products"
                    >
                        Shop Now
                    </Button>
                </Col>
            </Row>

            {/* Special Offers Banner */}
            <Row className="mb-5">
                <Col md={12}>
                    <div
                        style={{
                            background: "linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 180, 216, 0.1))",
                            border: "1px solid var(--accent)",
                            borderRadius: "20px",
                            padding: "30px",
                            textAlign: "center",
                        }}
                    >
                        <h2 style={{ color: "var(--accent)", fontWeight: "700", marginBottom: "10px" }}>
                            🎉 Flash Sale - Up to 50% Off!
                        </h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                            Don't miss out on our limited-time offers. Shop now before it's too late!
                        </p>
                    </div>
                </Col>
            </Row>

            {/* Product Categories Grid */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4" style={{ color: "#ffffff", textAlign: "center" }}>
                        Shop by Category
                    </h2>
                </Col>
                {categories.map((category, idx) => (
                    <Col xs={6} sm={4} md={3} className="mb-3" key={idx}>
                        <Link
                            to={category.path}
                            style={{ textDecoration: "none" }}
                        >
                            <div
                                className="text-center p-4"
                                style={cardStyle}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                                onMouseLeave={(e) =>
                                    Object.assign(e.currentTarget.style, cardStyle)
                                }
                            >
                                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>
                                    {category.icon}
                                </div>
                                <h6 style={{ color: "#ffffff", margin: 0 }}>
                                    {category.name}
                                </h6>
                            </div>
                        </Link>
                    </Col>
                ))}
            </Row>

            {/* Featured Products - Improved Design */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h2 className="fw-bold mb-0" style={{ color: "#ffffff" }}>
                            Featured Products
                        </h2>
                        <Button
                            variant="outline-light"
                            size="sm"
                            as={Link}
                            to="/products"
                            style={{
                                borderColor: "var(--accent)",
                                color: "var(--accent)",
                                borderRadius: "8px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--accent)";
                                e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "var(--accent)";
                            }}
                        >
                            View All →
                        </Button>
                    </div>
                </Col>
                {loading ? (
                    <Col md={12} className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </Col>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={product._id}>
                            <Link
                                to={`/products/${product._id}`}
                                style={{ textDecoration: "none", display: "block", height: "100%" }}
                            >
                                <Card
                                    className="h-100"
                                    style={{
                                        ...cardStyle,
                                        overflow: "hidden",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-8px)";
                                        e.currentTarget.style.borderColor = "var(--accent)";
                                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 180, 216, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.borderColor = "var(--border)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            backgroundColor: "#ffffff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            position: "relative",
                                            padding: "10px",
                                        }}
                                    >
                                        <img
                                            src={product.image || "https://via.placeholder.com/200"}
                                            alt={product.productname}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "100%",
                                                width: "auto",
                                                height: "auto",
                                                objectFit: "contain",
                                                objectPosition: "center center",
                                                display: "block",
                                            }}
                                        />
                                        <Badge
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                                backgroundColor: "var(--accent)",
                                                padding: "5px 10px",
                                                borderRadius: "20px",
                                            }}
                                        >
                                            {product.category}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title
                                            style={{
                                                color: "#ffffff",
                                                fontSize: "1rem",
                                                marginBottom: "10px",
                                                fontWeight: "600",
                                                textDecoration: "none",
                                            }}
                                        >
                                            {product.productname}
                                        </Card.Title>
                                        <Card.Text
                                            style={{
                                                color: "var(--text-muted)",
                                                fontSize: "0.85rem",
                                                flex: 1,
                                                marginBottom: "15px",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textDecoration: "none",
                                            }}
                                        >
                                            {product.description}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <h5 style={{ color: "var(--accent)", margin: 0, fontWeight: "700" }}>
                                                ₹{product.price}
                                            </h5>
                                            <span
                                                style={{
                                                    color: "var(--accent)",
                                                    fontSize: "0.9rem",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                View Details →
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <Col md={12} className="text-center py-5">
                        <p style={{ color: "var(--text-muted)" }}>No products available yet.</p>
                    </Col>
                )}
            </Row>

            {/* Why Choose Us & Benefits Combined */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4" style={{ color: "#ffffff", textAlign: "center" }}>
                        Why Choose Us?
                    </h2>
                </Col>
                {stats.map((stat, idx) => (
                    <Col xs={6} md={3} className="mb-4" key={idx}>
                        <div
                            className="text-center p-4"
                            style={cardStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                            onMouseLeave={(e) =>
                                Object.assign(e.currentTarget.style, cardStyle)
                            }
                        >
                            <h3 style={{ color: "var(--accent)", fontSize: "2.5rem", marginBottom: "10px", fontWeight: "700" }}>
                                {stat.number}
                            </h3>
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
                                {stat.label}
                            </p>
                        </div>
                    </Col>
                ))}
            </Row>

            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4" style={{ color: "#ffffff", textAlign: "center" }}>
                        Our Benefits
                    </h2>
                </Col>
                {benefits.map((benefit, idx) => (
                    <Col xs={12} sm={6} md={3} className="mb-4 d-flex" key={idx}>
                        <div
                            className="p-4 text-center w-100"
                            style={cardStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                            onMouseLeave={(e) =>
                                Object.assign(e.currentTarget.style, cardStyle)
                            }
                        >
                            <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>
                                {benefit.icon}
                            </div>
                            <h5 style={{ color: "#ffffff", marginBottom: "10px", fontWeight: "600" }}>
                                {benefit.title}
                            </h5>
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
                                {benefit.desc}
                            </p>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Testimonials */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4" style={{ color: "#ffffff", textAlign: "center" }}>
                        What Our Customers Say
                    </h2>
                </Col>
                {testimonials.map((testimonial, idx) => (
                    <Col xs={12} sm={6} md={3} className="mb-4" key={idx}>
                        <div
                            className="p-4"
                            style={cardStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                            onMouseLeave={(e) =>
                                Object.assign(e.currentTarget.style, cardStyle)
                            }
                        >
                            <div style={{ color: "var(--accent)", marginBottom: "15px", fontSize: "1.2rem" }}>
                                {"⭐".repeat(testimonial.rating)}
                            </div>
                            <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "15px", lineHeight: "1.6" }}>
                                "{testimonial.text}"
                            </p>
                            <p style={{ color: "#ffffff", fontWeight: "600", margin: 0 }}>
                                — {testimonial.name}
                            </p>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;

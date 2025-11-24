import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';
import EdButton from '../../components/ui/button';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
        { name: "Rajesh Kumar", rating: 5, text: "Amazing quality products at great prices! Fast delivery too." },
        { name: "Priya Sharma", rating: 5, text: "Best place to buy electronics. Genuine products only!" },
        { name: "Amit Patel", rating: 5, text: "Excellent customer service. Highly recommended!" },
        { name: "Sneha Reddy", rating: 5, text: "Love the variety and competitive pricing. Will shop again!" },
    ];

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await axios.get(`${BACKEND_API}/products`);
                const fetched = res.data.products || [];
                const featuredProducts = [];
                const categoryMap = new Map();
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
                fetched.forEach(product => {
                    if (product.category) {
                        const categoryKey = product.category.toLowerCase();
                        const normalizedCategory = categoryVariations[categoryKey] || categoryKey;
                        if (!categoryMap.has(normalizedCategory)) {
                            categoryMap.set(normalizedCategory, product);
                        }
                    }
                });
                categories.forEach(category => {
                    const categoryKey = category.path.split("category=")[1]?.toLowerCase();
                    if (categoryMap.has(categoryKey)) {
                        featuredProducts.push(categoryMap.get(categoryKey));
                    }
                });
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
                    <h1 className="fw-bold display-5 mb-3">
                        Welcome to <span className="text-primary" style={{ color: 'var(--accent)' }}>Electron</span>.store
                    </h1>
                    <p className="mb-4 fs-5 text-muted">
                        Your one-stop shop for mobiles, earphones, smartwatches, and all electronic accessories — at unbeatable prices.
                    </p>
                    <EdButton className="px-4 py-2 fw-semibold" style={{ borderRadius: "var(--radius)" }} as={Link} to="/products">
                        Shop Now
                    </EdButton>
                </Col>
            </Row>

            {/* Special Offers Banner */}
            <Row className="mb-5">
                <Col md={12}>
                    <div
                        className="ed-card text-center"
                        style={{
                            background: "linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 180, 216, 0.1))",
                            border: "1px solid var(--accent)",
                            borderRadius: "20px"
                        }}
                    >
                        <h2 className="fw-bold mb-2" style={{ color: "var(--accent)" }}>
                            🎉 Flash Sale - Up to 50% Off!
                        </h2>
                        <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                            Don't miss out on our limited-time offers. Shop now before it's too late!
                        </p>
                    </div>
                </Col>
            </Row>

            {/* Product Categories Grid */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4 text-center">
                        Shop by Category
                    </h2>
                </Col>
                {categories.map((category, idx) => (
                    <Col xs={6} sm={4} md={3} className="mb-3" key={idx}>
                        <Link to={category.path} className="text-decoration-none">
                            <div className="ed-card text-center py-4 clickable-card" tabIndex={0}>
                                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>
                                    {category.icon}
                                </div>
                                <h6 className="mb-0">{category.name}</h6>
                            </div>
                        </Link>
                    </Col>
                ))}
            </Row>

            {/* Featured Products */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h2 className="fw-bold mb-0 text-center">Featured Products</h2>
                        <EdButton variant="outline" className="px-3 py-1" as={Link} to="/products" style={{ borderRadius: "8px" }}>
                            View All →
                        </EdButton>
                    </div>
                </Col>
                {loading ? (
                    <Col md={12} className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </Col>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={product._id}>
                            <Link to={`/products/${product._id}`} className="text-decoration-none d-block h-100">
                                <div className="ed-card h-100 clickable-card" tabIndex={0}>
                                    <div className="bg-white d-flex align-items-center justify-content-center position-relative" style={{ width: "100%", height: "200px", overflow: "hidden", padding: "10px" }}>
                                        <img
                                            src={product.image || "https://via.placeholder.com/200"}
                                            alt={product.productname}
                                            style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain", objectPosition: "center center", display: "block" }}
                                        />
                                        <Badge bg="primary" style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "var(--accent)", padding: "5px 10px", borderRadius: "20px" }}>
                                            {product.category}
                                        </Badge>
                                    </div>
                                    <div className="d-flex flex-column px-3 py-2" style={{ flex: 1 }}>
                                        <h6 className="fw-semibold text-white mb-2" style={{ fontSize: "1rem" }}>{product.productname}</h6>
                                        <div className="text-muted small mb-2" style={{ height: "2.6em", overflow: "hidden", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", display: "-webkit-box" }}>{product.description}</div>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <span className="fw-bold" style={{ color: "var(--accent)" }}>₹{product.price}</span>
                                            <span style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 500 }}>View Details →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <Col md={12} className="text-center py-5">
                        <p className="text-muted">No products available yet.</p>
                    </Col>
                )}
            </Row>

            {/* Why Choose Us */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4 text-center">Why Choose Us?</h2>
                </Col>
                {stats.map((stat, idx) => (
                    <Col xs={6} md={3} className="mb-4" key={idx}>
                        <div className="ed-card text-center py-4 clickable-card" tabIndex={0}>
                            <h3 className="fw-bold" style={{ color: "var(--accent)", fontSize: "2.5rem", marginBottom: "10px" }}>{stat.number}</h3>
                            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>{stat.label}</p>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Our Benefits */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4 text-center">Our Benefits</h2>
                </Col>
                {benefits.map((benefit, idx) => (
                    <Col xs={12} sm={6} md={3} className="mb-4 d-flex" key={idx}>
                        <div className="ed-card p-4 text-center w-100 clickable-card" tabIndex={0}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>{benefit.icon}</div>
                            <h5 className="text-white mb-2 fw-semibold">{benefit.title}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>{benefit.desc}</p>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Testimonials */}
            <Row className="mb-5">
                <Col md={12} className="mb-4">
                    <h2 className="fw-bold mb-4 text-center">What Our Customers Say</h2>
                </Col>
                {testimonials.map((testimonial, idx) => (
                    <Col xs={12} sm={6} md={3} className="mb-4" key={idx}>
                        <div className="ed-card p-4 clickable-card" tabIndex={0}>
                            <div style={{ color: "var(--accent)", marginBottom: "15px", fontSize: "1.2rem" }}>{"⭐".repeat(testimonial.rating)}</div>
                            <p className="text-muted mb-2" style={{ fontStyle: "italic", lineHeight: 1.6 }}>
                                "{testimonial.text}"
                            </p>
                            <p className="fw-semibold text-white mb-0">— {testimonial.name}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;

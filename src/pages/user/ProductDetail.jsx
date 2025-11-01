import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';
import Loading from '../../components/common/Loading';
import { useCart } from "../../context/CartContext";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await axios.get(`${BACKEND_API}/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

if (loading) return <Loading message="Loading product..." />;
    if (!product) return <Container className="py-5 text-center">Product not found.</Container>;

    return (
        <Container className="py-5">
            <Row>
                <Col md={6}>
                    <div style={{ background: "#fff", padding: 20 }}>
                        <img src={product.image} alt={product.productname} style={{ width: "100%", objectFit: "contain" }} />
                    </div>
                </Col>
                <Col md={6}>
                    <h2 style={{ color: "#fff" }}>{product.productname}</h2>
                    <p style={{ color: "var(--text-muted)" }}>{product.description}</p>
                    <p><strong style={{ color: "var(--accent)" }}>₹{product.price}</strong></p>
                    <p><Badge style={{ backgroundColor: "var(--accent)" }}>{product.category}</Badge> <span style={{ color: "var(--text-muted)", marginLeft: 10 }}>{product.brand}</span></p>

          <div className="d-flex align-items-center gap-3 mt-4">
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 80, padding: 8, borderRadius: 8 }} />
            <Button onClick={() => { addToCart(product, qty); toast.success('Added to cart'); }} style={{ backgroundColor: "var(--accent)", border: "none" }}>Add to Cart</Button>
                        <Link to="/cart" className="btn btn-outline-light">Go to Cart</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;



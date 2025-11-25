// src/pages/ProductDetail.jsx
import { Container, Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';
import Loading from '../../components/common/Loading';
import { useCart } from "../../context/CartContext";
import EdButton from '../../components/ui/button';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const controllerRef = useRef(null);

  // price formatter
  const priceFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    controllerRef.current = controller;

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_API}/products/${id}`, { signal: controller.signal });
        if (!mounted) return;
        setProduct(res.data.product || null);
      } catch (err) {
        const isAbort = err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || err?.message?.toLowerCase?.().includes('canceled');
        if (!isAbort) {
          console.error("Failed to fetch product:", err);
          toast.error("Failed to load product");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      mounted = false;
      try { controller.abort(); } catch {}
    };
  }, [id]);

  if (loading) return <Loading message="Loading product..." />;
  if (!product) return <Container className="py-5 text-center">Product not found.</Container>;

  const handleAddToCart = () => {
    const safeQty = Math.max(1, Math.floor(Number(qty) || 1));
    if (typeof addToCart === "function") {
      addToCart(product, safeQty);
      toast.success("Added to cart");
    } else {
      toast.info("Add-to-cart not available");
    }
  };

  return (
    <Container className="py-5">
      {/* Scoped responsive styles for the detail page */}
      <style>{`
        /* Image container keeps uniform aspect and scales responsively */
        .pd-image-container {
          width: 100%;
          max-width: 520px;
          height: min(52vh, 520px);
          background: #fff;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 0 auto;
        }
        .pd-image-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* Layout tweaks for small screens */
        @media (max-width: 992px) {
          .pd-image-container { max-width: 420px; height: min(46vh, 420px); }
        }
        @media (max-width: 576px) {
          .pd-image-container { max-width: calc(100vw - 32px); height: min(50vh, 360px); padding: 8px; }
          /* make buttons wrap nicely on small screens */
          .pd-actions { flex-direction: column; gap: 10px; align-items: stretch; }
          .pd-actions .ed-btn { width: 100%; justify-content: center; }
        }

        /* Keep consistent gap between input and buttons */
        .pd-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

        /* Input responsive style */
        .pd-qty-input {
          width: 96px;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: transparent;
          color: var(--text);
        }
      `}</style>

      <Row>
        {/* Image column - on small screens this will stack above details automatically */}
        <Col md={6} className="d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <div
            className="pd-image-container"
            role="img"
            aria-label={product.productname}
          >
            <img
              src={product.image || "https://via.placeholder.com/400"}
              alt={product.productname}
              loading="lazy"
            />
          </div>
        </Col>

        {/* Details column */}
        <Col md={6}>
          <h2 style={{ color: "#fff" }}>{product.productname}</h2>
          <p style={{ color: "var(--text-muted)" }}>{product.description}</p>

          <p style={{ margin: '0.5rem 0' }}>
            <strong style={{ color: "var(--accent)", fontSize: '1.25rem' }}>
              {typeof product.price === "number" ? priceFmt.format(product.price) : `₹${product.price}`}
            </strong>
          </p>

          <p style={{ margin: '0.5rem 0' }}>
            <Badge style={{ backgroundColor: "var(--accent)" }}>{product.category}</Badge>
            <span style={{ color: "var(--text-muted)", marginLeft: 10 }}>{product.brand}</span>
          </p>

          <div className="pd-actions mt-4">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isNaN(v)) return setQty(1);
                setQty(Math.max(1, Math.floor(v)));
              }}
              className="pd-qty-input"
              aria-label="Quantity"
            />

            <EdButton onClick={handleAddToCart} className="px-3 py-2">
              Add to Cart
            </EdButton>

            <Link to="/cart" className="text-decoration-none">
              <EdButton as="a" variant="outline" className="px-3 py-2">
                Go to Cart
              </EdButton>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;

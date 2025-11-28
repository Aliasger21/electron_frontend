import React, { useEffect, useRef, useState } from "react";
import { Container, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from "../../config";
import Loading from "../../components/common/Loading";
import { useCart } from "../../context/CartContext";
import EdButton from "../../components/ui/button";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const cartCtx = useCart();
  const addToCart = cartCtx?.addToCart;
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_API}/products/${id}`, {
          signal: controller.signal,
        });
        const fetched = res?.data?.product ?? res?.data ?? null;
        if (mounted) setProduct(fetched);
      } catch (err) {
        if (!mounted) return;
        console.error("Product fetch error:", err);
        toast.error(err?.response?.data?.message || "Failed to load product.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) fetchProduct();
    else {
      setLoading(false);
      setProduct(null);
    }

    return () => {
      mounted = false;
      try {
        controller.abort();
      } catch { }
    };
  }, [id]);

  const handleAddToCart = () => {
    try {
      const qtyNum = Math.max(1, Math.floor(Number(qty) || 1));
      if (typeof addToCart === "function") {
        addToCart(product, qtyNum);
        toast.success("Added to cart");
      } else {
        toast.info("Add-to-cart not available");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Could not add to cart");
    }
  };

  if (loading) return <Loading message="Loading product..." />;
  if (!product) return <Container className="py-5 text-center">Product not found.</Container>;

  const image =
    product?.image ||
    product?.images?.[0] ||
    "https://via.placeholder.com/1200x800?text=No+Image";

  const name = product?.productname || product?.name || "Unnamed product";
  const description = product?.description || "No description available.";
  const category = product?.category || "Uncategorized";
  const brand = product?.brand || "";
  const priceRaw = product?.price ?? null;

  const formattedPrice =
    typeof priceRaw === "number"
      ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(priceRaw)
      : priceRaw
        ? `₹${priceRaw}`
        : "Price not available";

  return (
    <div
      ref={containerRef}
      style={{
        padding: 0,
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        maxWidth: "1200px",
        margin: "40px auto 0",
      }}
    >
      {/* LOCAL CSS FIXED FOR RESPONSIVENESS (Option A: object-fit: cover) */}
      <style>{`
        /* ---------- Layout ---------- */
        .pd-grid {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .pd-left { flex: 1; }
        .pd-right { width: 360px; }

        /* ---------- Product detail viewport ---------- */
        /* Use a fixed aspect container so image area is consistent across different image aspect ratios */
        .pd-viewport {
          width: 100%;
          max-width: 600px;
          aspect-ratio: 4 / 3; /* desktop/tablet ratio */
          background: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: auto;
          padding: 10px;
          box-sizing: border-box;
        }

        /* ---------- OPTION A (ACTIVE): uniform fill, consistent visible size (cropped if necessary) ---------- */
        .pd-img {
          width: 100%;
          height: 100%;
          object-fit: cover;  /* fills the container and keeps images perfectly uniform */
          object-position: center center;
          display: block;
        }

        /* ---------- Controls and spacing ---------- */
        .pd-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .pd-qty-input {
          height: 34px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          width: 80px;
          max-width: 80px;
        }

        /* ---------- Reusable thumbnail class for product lists/cards ---------- */
        .uniform-thumb {
          width: 100%;
          aspect-ratio: 1 / 1;  /* square thumbnails; change to 4/3 if you prefer */
          overflow: hidden;
          border-radius: 8px;
          background: #fff;
          display: block;
          position: relative;
        }
        .uniform-thumb .uniform-img {
          width: 100%;
          height: 100%;
          object-fit: cover;    /* same tradeoff: cover = consistent fill */
          object-position: center center;
          display: block;
        }

        /* ---------- MOBILE STYLING ---------- */
        @media (max-width: 992px) {
          .pd-grid {
            flex-direction: column;
            padding: 0 6vw;
          }
          .pd-right {
            width: 100%;
            margin-top: 18px;
          }

          /* mobile: prefer square preview for product detail */
          .pd-viewport {
            aspect-ratio: 1 / 1;
            max-height: 46vw;
            min-height: 210px;
            padding: 4vw 2vw;
          }

          /* STACK BUTTONS */
          .pd-actions {
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
          }

          /* FULL WIDTH BUTTONS */
          .pd-add-btn,
          .pd-cart-btn {
            width: 100% !important;
            display: block;
          }

          .pd-qty-input {
            width: 100%;
          }
        }

        /* ---------- Small helpers (optional) ---------- */
        .img-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="pd-grid">
        {/* LEFT SIDE IMAGE */}
        <div className="pd-left">
          <div className="pd-viewport">
            <img
              src={image}
              alt={name}
              className="pd-img"
              onError={(e) =>
              (e.currentTarget.src =
                "https://via.placeholder.com/1200x800?text=No+Image")
              }
            />
          </div>
        </div>

        {/* RIGHT SIDE INFO */}
        <div className="pd-right">
          <h2 style={{ margin: "0.5rem 0" }}>{name}</h2>
          <p style={{ color: "var(--text-muted)" }}>{description}</p>

          <p style={{ margin: "0.5rem 0" }}>
            <strong style={{ color: "var(--accent)", fontSize: "1.25rem" }}>
              {formattedPrice}
            </strong>
          </p>

          <p style={{ margin: "0.5rem 0" }}>
            <Badge style={{ backgroundColor: "var(--accent)" }}>
              {category}
            </Badge>
            {brand ? (
              <span style={{ color: "var(--text-muted)", marginLeft: 10 }}>
                {brand}
              </span>
            ) : null}
          </p>

          {/* ACTION BUTTONS */}
          <div className="pd-actions mt-4">
            <input
              id="pd-qty"
              className="pd-qty-input"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                const v = Number(e.target.value);
                setQty(Number.isNaN(v) ? 1 : Math.max(1, Math.floor(v)));
              }}
            />

            <EdButton onClick={handleAddToCart} className="pd-add-btn">
              Add to Cart
            </EdButton>

            <Link to="/cart" className="text-decoration-none">
              <EdButton className="pd-cart-btn">Go to Cart</EdButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

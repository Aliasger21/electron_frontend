// src/pages/user/Cart.jsx
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import EdButton from "../../components/ui/button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.qty || 1),
    0
  );

  if (!cart || cart.length === 0)
    return (
      <Container className="py-5 text-center">
        <h4 style={{ color: "#fff" }}>Your cart is empty</h4>
      </Container>
    );

  return (
    <Container className="py-5">
      <h3 style={{ color: "#fff" }}>Your Cart</h3>

      <Row className="mt-4">
        <Col md={8}>
          {cart.map((it) => (
            <Card key={it._id} className="mb-3 cart-card">
              {/* Responsive image wrapper */}
              <div className="product-image-wrapper">
                <img
                  src={it.image || "https://via.placeholder.com/300x180"}
                  alt={it.productname}
                  loading="lazy"
                  className="product-image"
                />
              </div>

              {/* Details */}
              <div className="cart-item-details">
                <div className="product-title">{it.productname}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {it.brand || ""}
                </div>

                <div className="d-flex align-items-center gap-2 mt-2" style={{ gap: 12, alignItems: "center" }}>
                  <div style={{ width: 120 }}>
                    <Input
                      type="number"
                      min={1}
                      value={Number(it.qty || 1)}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value || "1", 10));
                        updateQty(it._id, val);
                        toast.info("Quantity updated");
                      }}
                      aria-label={`Quantity for ${it.productname}`}
                    />
                  </div>

                  <EdButton
                    className="ms-1 gradient-primary"
                    onClick={() => {
                      removeFromCart(it._1d); // restored original logic but note: ensure id prop is _id
                      toast.info("Removed from cart");
                    }}
                  >
                    Remove
                  </EdButton>
                </div>
              </div>

              {/* Price area */}
              <div style={{ textAlign: "right", minWidth: 130 }}>
                <div style={{ color: "var(--accent)", fontWeight: 700 }}>
                  ₹{(Number(it.price || 0) * Number(it.qty || 1)).toFixed(2)}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  ₹{Number(it.price || 0).toFixed(2)} each
                </div>
              </div>
            </Card>
          ))}
        </Col>

        <Col md={4}>
          <Card>
            <h5 style={{ color: "#fff", marginBottom: 12 }}>Order Summary</h5>
            <div style={{ color: "var(--text-muted)", marginTop: 6 }}>
              {cart.map((it) => (
                <div key={it._id} className="d-flex justify-content-between mb-2" style={{ gap: 8 }}>
                  <div
                    style={{
                      color: "#fff",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={`${it.productname} x ${it.qty}`}
                  >
                    {it.productname} x {it.qty}
                  </div>
                  <div style={{ color: "var(--accent)", marginLeft: 8 }}>
                    ₹{(Number(it.qty || 1) * Number(it.price || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

            <div className="d-flex justify-content-between align-items-center">
              <div style={{ color: "var(--text-muted)" }}>Total</div>
              <div style={{ color: "var(--accent)", fontWeight: 700 }}>₹{total.toFixed(2)}</div>
            </div>

            <div className="d-grid gap-2 mt-3">
              <Link to="/checkout">
                <EdButton className="w-100 gradient-primary">
                  Proceed to Checkout
                </EdButton>
              </Link>

              <EdButton
                variant="outline"
                className="w-100"
                onClick={() => {
                  clearCart();
                  toast.info("Cart cleared");
                }}
              >
                Clear Cart
              </EdButton>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;

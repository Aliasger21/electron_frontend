// src/pages/user/Cart.jsx
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import EdButton from "../../components/ui/button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const { cart, updateQty, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0);

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
                        <Card key={it._id} className="mb-3" style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center", padding: 16 }}>
                            <div style={{ width: 120, flexShrink: 0 }}>
                                <img
                                    src={it.image || "https://via.placeholder.com/180"}
                                    alt={it.productname}
                                    className="ed-img-rect"
                                    style={{ background: "#fff", padding: 8, borderRadius: 8 }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ color: "#fff", fontWeight: 700 }}>{it.productname}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{it.brand || ""}</div>

                                <div className="d-flex align-items-center gap-2 mt-2" style={{ gap: 12 }}>
                                    <div style={{ width: 120 }}>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={it.qty}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 1);
                                                updateQty(it._id, Math.max(1, val));
                                                toast.info("Quantity updated");
                                            }}
                                            aria-label={`Quantity for ${it.productname}`}
                                        />
                                    </div>

                                    <EdButton
                                        variant="outline"
                                        className="ms-1"
                                        onClick={() => {
                                            removeFromCart(it._id);
                                            toast.info("Removed from cart");
                                        }}
                                    >
                                        Remove
                                    </EdButton>
                                </div>
                            </div>

                            <div style={{ textAlign: "right", minWidth: 130 }}>
                                <div style={{ color: "var(--accent)", fontWeight: 700 }}>₹{(Number(it.price) * it.qty).toFixed(2)}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>₹{Number(it.price).toFixed(2)} each</div>
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
                                    <div style={{ color: "#fff", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {it.productname} x {it.qty}
                                    </div>
                                    <div style={{ color: "var(--accent)", marginLeft: 8 }}>₹{(it.qty * it.price).toFixed(2)}</div>
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
                                <EdButton>Proceed to Checkout</EdButton>
                            </Link>

                            <EdButton
                                variant="outline"
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

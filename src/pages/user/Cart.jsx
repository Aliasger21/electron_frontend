import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const Cart = () => {
    const { cart, updateQty, removeFromCart, clearCart } = useCart();

    const total = cart.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0);

    if (cart.length === 0)
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
                        <div key={it._id} className="d-flex align-items-center gap-3 mb-3 p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
                            <div style={{ width: 100, maxWidth: '28vw' }}>
                                <img src={it.image || 'https://via.placeholder.com/100'} alt={it.productname} className="responsive-img" style={{ background: '#fff', padding: 8 }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 700 }}>{it.productname}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{it.brand || ''}</div>
                                <div className="d-flex align-items-center gap-2 mt-2">
                                    <input type="number" value={it.qty} min={1} onChange={(e) => { updateQty(it._id, Number(e.target.value)); toast.info('Quantity updated'); }} className="responsive-input" />
                                    <Button variant="outline-danger" size="sm" onClick={() => { removeFromCart(it._id); toast.info('Removed from cart'); }}>Remove</Button>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{(Number(it.price) * it.qty).toFixed(2)}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{it.price} each</div>
                            </div>
                        </div>
                    ))}
                </Col>
                <Col md={4}>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                        <h5 style={{ color: '#fff' }}>Order Summary</h5>
                        <div style={{ color: 'var(--text-muted)', marginTop: 10 }}>
                            {cart.map(it => (
                                <div key={it._id} className="d-flex justify-content-between mb-2">
                                    <div style={{ color: '#fff' }}>{it.productname} x {it.qty}</div>
                                    <div style={{ color: 'var(--accent)' }}>₹{(it.qty * it.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                        <hr style={{ borderColor: 'var(--border)' }} />
                        <div className="d-flex justify-content-between align-items-center">
                            <div style={{ color: 'var(--text-muted)' }}>Total</div>
                            <div style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{total.toFixed(2)}</div>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <Button as={"a"} href="/checkout" className="btn-accent">Proceed to Checkout</Button>
                            <Button variant="outline-light" onClick={() => { clearCart(); toast.info('Cart cleared'); }}>Clear Cart</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;



import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/LoadingContext';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [customer, setCustomer] = useState({ name: '', email: '', address: '', phone: '' });

  const total = cart.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0);

  const handleChange = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      try {
        const raw = localStorage.getItem('user');
        if (!raw) return;
        const u = JSON.parse(raw);
        const name = ((u.firstname || '') + ' ' + (u.lastname || '')).trim();
        setCustomer(c => ({ ...c,
          name: name || c.name,
          email: u.email || c.email,
          address: u.address || c.address,
          phone: u.phone || c.phone
        }));
      } catch (e) {
        // ignore
      }
    };

    loadUser();
    const onAuth = () => loadUser();
    window.addEventListener('authChanged', onAuth);
    return () => window.removeEventListener('authChanged', onAuth);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Cart is empty');

    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please log in or register before placing an order');
      navigate('/login');
      return;
    }

    setLoading(true);
    try { if (showLoading) showLoading('Placing your order...'); } catch {}
    try {
      const payload = { items: cart.map(({ _id, productname, price, qty }) => ({ productId: _id, productname, price, qty })), customer };
      const headers = { Authorization: token };
      const res = await axios.post(`${BACKEND_API}/orders`, payload, { headers });
      toast.success('Order placed successfully');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        toast.error('Not authorized — please login');
        navigate('/login');
      } else {
        toast.error('Failed to place order');
      }
    } finally { setLoading(false); try { if (hideLoading) hideLoading(); } catch {} }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <h3 style={{ color: '#fff' }}>Shipping & Payment</h3>
          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={customer.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={customer.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" rows={3} name="address" value={customer.address} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={customer.phone} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--accent)', border: 'none' }}>
              {loading ? 'Placing order...' : `Pay & Place Order (₹${total.toFixed(2)})`}
            </Button>
          </Form>
        </Col>
        <Col md={4}>
          <h4 style={{ color: '#fff' }}>Order Summary</h4>
          <div className="mt-3" style={{ color: 'var(--text-muted)' }}>
            {cart.map(it => (
              <div key={it._id} className="d-flex justify-content-between mb-2">
                <div>{it.productname} x {it.qty}</div>
                <div>₹{(it.qty * it.price).toFixed(2)}</div>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold">Total <div>₹{total.toFixed(2)}</div></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;



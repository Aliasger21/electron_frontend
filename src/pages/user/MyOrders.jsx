import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await axios.get(`${BACKEND_API}/orders/my`, { headers: { Authorization: token } });
        setOrders(res.data.orders || []);
      } catch (err) { console.error(err); toast.error('Failed to load orders'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${BACKEND_API}/orders/${id}/cancel`, {}, { headers: { Authorization: token } });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
      toast.success(res.data?.message || 'Order cancelled');
    } catch (err) { console.error(err); toast.error('Failed to cancel'); }
  };

  return (
    <Container className="py-5">
      <h3 style={{ color: '#fff' }}>My Orders</h3>
            {loading ? <Loading message="Loading your orders..." /> : orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders yet</p> : (
        <Row className="g-3">
          {orders.map(o => (
            <Col md={6} key={o._id}>
              <div className="order-card">
                <div className="order-top">
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Order #{o._id}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <Badge className="order-status" bg={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'secondary' : 'warning'}>{o.status}</Badge>
                </div>
                <div style={{ marginTop: 12 }}>
                  {o.items.map(it => (
                    <div key={it.productId} className="d-flex justify-content-between">
                      <div style={{ color: '#fff' }}>{it.productname} x {it.qty}</div>
                      <div style={{ color: 'var(--text-muted)' }}>₹{(it.qty * it.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>
                  <div>Contact: {o.customer?.phone || 'N/A'}</div>
                  <div>Address: {o.customer?.address || 'N/A'}</div>
                  <div>Estimated Delivery: {o.estimatedDelivery ? new Date(o.estimatedDelivery).toLocaleDateString() : 'N/A'}</div>
                  {o.trackingUrl && (
                    <div><a href={o.trackingUrl} target="_blank" rel="noreferrer">Track Package</a></div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Total: ₹{o.total}</div>
                  <div>
                    {o.status !== 'cancelled' && o.status !== 'completed' && (
                      <Button variant="outline-light" size="sm" onClick={() => handleCancel(o._id)}>Cancel</Button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyOrders;



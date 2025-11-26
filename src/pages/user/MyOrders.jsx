import { Container, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [cancelingId, setCancelingId] = useState(null); // id being canceled (for disabling)

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_API}/orders/my`, {
          headers: getAuthHeader(),
        });
        setOrders(res.data.orders || res.data?.orders || []);
      } catch (err) {
        console.error('LOAD ORDERS ERROR:', err);
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load orders'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // open modal for a specific order
  const confirmCancel = (order) => {
    setModalOrder(order);
    setShowCancelModal(true);
  };

  // perform cancel (called by modal Confirm)
  const performCancel = async () => {
    if (!modalOrder) return;
    const id = modalOrder._id;

    setCancelingId(id);

    try {
      const res = await axios.post(
        `${BACKEND_API}/orders/${id}/cancel`,
        {},
        { headers: getAuthHeader() }
      );

      const updatedOrder = res.data.order || res.data?.order;
      if (updatedOrder) {
        setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));
      } else {
        setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: 'cancelled' } : o)));
      }

      toast.success(res.data?.message || 'Order cancelled');
      setShowCancelModal(false);
      setModalOrder(null);
    } catch (err) {
      console.error('CANCEL ERROR:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.data?.message ||
        (err.response ? `Error ${err.response.status}` : err.message);
      toast.error(msg || 'Failed to cancel order');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <Container className="py-5">
      <h3 style={{ color: '#fff' }}>My Orders</h3>

      {loading ? (
        <Loading message="Loading your orders..." />
      ) : orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No orders yet</p>
      ) : (
        <Row className="g-3">
          {orders.map((o) => (
            <Col md={6} key={o._id}>
              <div className="order-card">
                <div className="order-top">
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>
                      Order #{o._id}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <Badge
                    className="order-status"
                    bg={
                      o.status === 'completed'
                        ? 'success'
                        : o.status === 'cancelled'
                          ? 'secondary'
                          : 'warning'
                    }
                  >
                    {o.status}
                  </Badge>
                </div>

                <div style={{ marginTop: 12 }}>
                  {o.items.map((it) => (
                    <div
                      key={it.productId}
                      className="d-flex justify-content-between"
                    >
                      <div style={{ color: '#fff' }}>
                        {it.productname} x {it.qty}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        ₹{(it.qty * it.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>
                  <div>Contact: {o.customer?.phone || 'N/A'}</div>
                  <div>Address: {o.customer?.address || 'N/A'}</div>
                  <div>
                    Estimated Delivery:{' '}
                    {o.estimatedDelivery
                      ? new Date(o.estimatedDelivery).toLocaleDateString()
                      : 'N/A'}
                  </div>
                  {o.trackingUrl && (
                    <div>
                      <a href={o.trackingUrl} target="_blank" rel="noreferrer">
                        Track Package
                      </a>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    Total: ₹{o.total}
                  </div>

                  <div>
                    {o.status !== 'cancelled' && o.status !== 'completed' && (
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => confirmCancel(o)}
                        disabled={!!cancelingId}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Cancel confirmation modal */}
      <Modal
        show={showCancelModal}
        onHide={() => { if (!cancelingId) { setShowCancelModal(false); setModalOrder(null); } }}
        centered
      >
        <Modal.Header closeButton={!cancelingId}>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalOrder ? (
            <>
              <p>Are you sure you want to cancel this order?</p>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                <div><strong>Order:</strong> #{modalOrder._id}</div>
                <div><strong>Date:</strong> {new Date(modalOrder.createdAt).toLocaleString()}</div>
                <div><strong>Total:</strong> ₹{modalOrder.total}</div>
                <div style={{ marginTop: 8, color: '#fff' }}>
                  Cancelling will mark this order as <strong>cancelled</strong>.
                </div>
              </div>
            </>
          ) : (
            <p>Preparing...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowCancelModal(false); setModalOrder(null); }} disabled={!!cancelingId}>
            Close
          </Button>
          <Button variant="danger" onClick={performCancel} disabled={!!cancelingId}>
            {cancelingId ? 'Cancelling...' : 'Confirm Cancel'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyOrders;

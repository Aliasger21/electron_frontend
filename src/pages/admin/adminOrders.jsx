import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_API } from '../../config';
import { Table, Button, Container } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loading from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await axios.get(`${BACKEND_API}/orders`);
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${BACKEND_API}/orders/${id}/status`, { status });
            setOrders((prev) => prev.map(o => o._id === id ? { ...o, status } : o));
        } catch (err) {
            console.error(err);
        }
    };

    const handleConfirmDelete = async () => {
        const id = confirmDeleteId;
        if (!id) return setConfirmDeleteId(null);
        try {
            await axios.delete(`${BACKEND_API}/orders/${id}`);
            setOrders(prev => prev.filter(x => x._id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmDeleteId(null);
        }
    };



    return (
        <Container className="py-4">
            <h3 className="mb-3">Manage Orders</h3>
            {loading ? (
                <Loading fullScreen={false} message="Loading orders..." />
            ) : (
                <div className="d-flex flex-column gap-3">
                    {orders.map((o) => (
                        <div key={o._id} className="order-card">
                            <div className="order-top">
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 700 }}>Order #{o._id}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{o.customer?.name} • <small>{o.customer?.email}</small></div>
                                    <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>{new Date(o.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="text-end">
                                    <div style={{ marginBottom: 8 }}>
                                        <strong style={{ color: 'var(--accent)', fontSize: 18 }}>₹{o.total}</strong>
                                    </div>
                                    <div>
                                        <span className={`badge bg-${o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'secondary' : 'warning'}`}>
                                            {o.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="order-items">
                                {o.items.map(it => (
                                    <div key={it.productId} className="item">
                                        <div style={{ color: '#fff' }}>{it.productname} x {it.qty}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>₹{(it.qty * it.price).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>
                                <div>Contact: {o.customer?.phone || 'N/A'}</div>
                                <div>Address: {o.customer?.address || 'N/A'}</div>
                            </div>

                            <div className="d-flex gap-2 mt-3 flex-wrap">
                                <Button size="sm" variant="outline-light" onClick={() => updateStatus(o._id, 'processing')}>Processing</Button>
                                <Button size="sm" variant="outline-success" onClick={() => updateStatus(o._id, 'completed')}>Complete</Button>
                                <Button size="sm" variant="outline-danger" onClick={() => setConfirmDeleteId(o._id)}>Delete</Button>
                                {o.status !== 'cancelled' && (
                                    <Button size="sm" variant="warning" onClick={() => updateStatus(o._id, 'cancelled')}>Cancel</Button>
                                )}
                                <div className="ms-auto d-flex align-items-center gap-2">
                                    <DatePicker
                                        selected={o.estimatedDelivery ? new Date(o.estimatedDelivery) : null}
                                        onChange={(date) => {
                                            const val = date ? date.toISOString() : null;
                                            axios.put(`${BACKEND_API}/orders/${o._id}/eta`, { estimatedDelivery: val }, { headers: { Authorization: localStorage.getItem('token') || '' } })
                                                .then(res => {
                                                    setOrders(prev => prev.map(p => p._id === o._id ? res.data.order : p));
                                                })
                                                .catch(err => {
                                                    console.error(err);
                                                    try { window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Failed to update ETA', variant: 'danger' } })); } catch (e) { }
                                                });
                                        }}
                                        placeholderText="Set ETA"
                                        className="form-control form-control-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ConfirmModal
                show={!!confirmDeleteId}
                title="Delete order"
                message="Are you sure you want to delete this order? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDeleteId(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Container>
    );
}

export default OrdersPage;

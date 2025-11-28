import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Badge, Spinner } from "react-bootstrap";
import EdCard from "../../components/ui/Card";
import EdButton from "../../components/ui/button";
import { Link } from "react-router-dom";
import { BACKEND_API } from '../../config';

const completedStatuses = ['paid', 'completed', 'delivered'];

const statusVariant = (status) => {
    const s = (status || '').toLowerCase();
    if (['paid', 'completed', 'delivered'].includes(s)) return 'success';
    if (['pending', 'processing'].includes(s)) return 'warning';
    if (['cancelled', 'refunded'].includes(s)) return 'danger';
    if (['shipped', 'in-transit'].includes(s)) return 'info';
    return 'secondary';
};

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: "Products", value: 0, link: "/admin/products" },
        { label: "Orders", value: 0, link: "/admin/orders" },
        { label: "Users", value: 0, link: "/admin/users" },
        { label: "Revenue", value: "₹0.00", link: null },
    ]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const token = localStorage.getItem('token');
    const axiosInstance = axios.create({
        baseURL: BACKEND_API,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    useEffect(() => {
        let mounted = true;

        async function loadAll() {
            setLoading(true);

            try {
                let orders = [];
                try {
                    const res = await axiosInstance.get('/orders');
                    const d = res.data;
                    orders = Array.isArray(d) ? d : (Array.isArray(d.orders) ? d.orders : (d.data && Array.isArray(d.data) ? d.data : []));
                } catch (err) {
                    try {
                        const res2 = await axiosInstance.get('/orders?limit=1000');
                        const d2 = res2.data;
                        orders = Array.isArray(d2) ? d2 : (Array.isArray(d2.orders) ? d2.orders : (d2.data && Array.isArray(d2.data) ? d2.data : []));
                    } catch (e) {
                        console.error('Orders fetch failed', err, e);
                        orders = [];
                    }
                }

                let products = [];
                try {
                    const pres = await axiosInstance.get('/products');
                    const pd = pres.data;
                    products = Array.isArray(pd) ? pd : (Array.isArray(pd.products) ? pd.products : (pd.data && Array.isArray(pd.data) ? pd.data : []));
                } catch (err) {
                    console.warn('Products fetch failed', err);
                    products = [];
                }

                let users = [];
                try {
                    const ures = await axiosInstance.get('/getsignup');
                    const ud = ures.data;
                    if (Array.isArray(ud)) users = ud;
                    else if (ud?.data?.data && Array.isArray(ud.data.data)) users = ud.data.data;
                    else if (ud?.data && Array.isArray(ud.data)) users = ud.data;
                    else if (ud?.users && Array.isArray(ud.users)) users = ud.users;
                    else users = [];
                } catch (err) {
                    console.warn('Users fetch failed', err);
                    users = [];
                }

                let revenueNum = 0;
                if (Array.isArray(orders)) {
                    revenueNum = orders.reduce((acc, o) => {
                        const s = (o.status || '').toLowerCase();
                        if (completedStatuses.includes(s)) {
                            const val = typeof o.total === 'number' ? o.total : parseFloat(String(o.total).replace(/[^0-9.-]+/g, "")) || 0;
                            return acc + val;
                        }
                        return acc;
                    }, 0);
                }

                const recent = Array.isArray(orders) ? orders.slice().sort((a, b) => {
                    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return tb - ta;
                }).slice(0, 8) : [];

                const prodMap = new Map();
                if (Array.isArray(orders)) {
                    orders.forEach(o => {
                        if (!Array.isArray(o.items)) return;
                        o.items.forEach(it => {
                            const pid = it.productId || it._id || (it.product && it.product._id) || (it.product && it.productId) || (it.product && it.product.id);
                            const name = it.productname || it.name || (it.product && (it.product.productname || it.product.title)) || 'Unnamed';
                            const qty = Number(it.qty || it.quantity || it.count || 0);
                            if (!pid) return;
                            const prev = prodMap.get(pid) || { name, sold: 0 };
                            prev.sold += isNaN(qty) ? 0 : qty;
                            prodMap.set(pid, prev);
                        });
                    });
                }
                if (prodMap.size === 0 && Array.isArray(products)) {
                    products.forEach(p => {
                        const sold = Number(p.sold || p.sales || p.soldCount || 0);
                        if (sold > 0) {
                            const pid = p._id || p.id || p.productId || p.productname;
                            prodMap.set(pid || p.productname, { name: p.productname || p.title || 'Unnamed', sold });
                        }
                    });
                }
                const top = Array.from(prodMap.entries()).map(([id, v]) => ({ id, name: v.name, sold: v.sold }))
                    .sort((a, b) => b.sold - a.sold).slice(0, 6);

                if (!mounted) return;

                setStats([
                    { label: "Products", value: products.length || 0, link: "/admin/products" },
                    { label: "Orders", value: orders.length || 0, link: "/admin/orders" },
                    { label: "Users", value: users.length || 0, link: "/admin/users" },
                    { label: "Revenue", value: `₹${Number(revenueNum.toFixed(2)).toLocaleString()}`, link: null },
                ]);

                setRecentOrders(recent);
                setTopProducts(top);
            } catch (err) {
                console.error("AdminDashboard load error", err);
                setStats([
                    { label: "Products", value: 0, link: "/admin/products" },
                    { label: "Orders", value: 0, link: "/admin/orders" },
                    { label: "Users", value: 0, link: "/admin/users" },
                    { label: "Revenue", value: "₹0.00", link: null },
                ]);
                setRecentOrders([]);
                setTopProducts([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadAll();
        return () => { mounted = false; };
    }, []);

    const updateStatus = async (id, status) => {
        setRecentOrders(prev => prev.map(o => {
            const oid = o._id || o.id || o.orderId;
            if (String(oid) === String(id)) return { ...o, status };
            return o;
        }));

        try {
            await axiosInstance.put(`/orders/${id}/status`, { status });
        } catch (err) {
            console.error('Status update failed', err);
            try {
                const res = await axiosInstance.get('/orders');
                const d = res.data;
                const orders = Array.isArray(d) ? d : (Array.isArray(d.orders) ? d.orders : []);
                const recent = orders.slice().sort((a, b) => {
                    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return tb - ta;
                }).slice(0, 8);
                setRecentOrders(recent);
            } catch (e) {
                console.error('Failed to reload orders after status update failure', e);
            }
        }
    };

    function RecentOrdersList({ recentOrders = [], loading = false }) {
        if (loading) return <div className="p-4 d-flex justify-content-center"><Spinner animation="border" /></div>;
        if (!recentOrders || recentOrders.length === 0) return <div className="p-4 text-center text-muted">No recent orders</div>;

        return (
            <div className="recent-orders-list">
                {recentOrders.map(o => {
                    const id = o._id || o.id || o.orderId || '';
                    const idLabel = id ? `#${String(id).slice(-8)}` : '#----';
                    const customerName = (o.customer && (o.customer.name || `${o.customer.firstname || ''} ${o.customer.lastname || ''}`)) || o.customer?.email || o.email || 'Customer';
                    const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString() : '-';
                    const totalStr = typeof o.total === 'number' ? `₹${o.total.toFixed(2)}` : (o.total ? String(o.total) : '-');
                    const items = Array.isArray(o.items) ? o.items : (o.orderItems || []);
                    const previewItems = items.slice(0, 2);

                    return (
                        <div key={id || Math.random()} className="order-card-row card p-3 mb-3">
                            <div className="d-flex align-items-start gap-3 order-card-inner">
                                <div className="order-left">
                                    <div className="order-id">{idLabel}</div>
                                    <div className="order-customer text-muted">{customerName}</div>
                                    <div className="order-date text-muted small">{dateStr}</div>
                                </div>

                                <div className="order-middle flex-grow-1">
                                    <div className="items-preview d-flex gap-2">
                                        {previewItems.length === 0 ? (
                                            <div className="text-muted small">No items</div>
                                        ) : previewItems.map((it, idx) => (
                                            <div key={idx} className="item-pill">
                                                <div className="item-name" title={it.productname || it.name || it.title || ''}>
                                                    {(it.productname || it.name || it.title || '').slice(0, 28)}
                                                </div>
                                                <div className="item-qty small text-muted">x{it.qty || it.quantity || 1}</div>
                                            </div>
                                        ))}
                                        {items.length > 2 && <div className="more-items small text-muted">+{items.length - 2} more</div>}
                                    </div>
                                </div>

                                <div className="order-right text-end">
                                    <div className="order-total fw-bold">{totalStr}</div>
                                    <div style={{ marginTop: 6 }}>
                                        <span className={`badge status-badge status-${(o.status || '').toLowerCase()}`} style={{ textTransform: 'capitalize' }}>
                                            {o.status || 'unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container" style={{ padding: 20, maxWidth: 1200, margin: '20px auto', boxSizing: 'border-box' }}>
            <Row className="g-3 mb-3">
                {stats.map(s => (
                    <Col key={s.label} xs={12} sm={6} md={6} lg={3}>
                        {s.link ? (
                            <Link to={s.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <EdCard className="card p-3 h-100" style={{ cursor: 'pointer' }}>
                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                        <div>
                                            <div className="card-title mb-1" style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
                                            <div className="h3 mb-0" style={{ fontWeight: 700 }}>{s.value}</div>
                                        </div>
                                        <div className="text-muted mt-2 mt-sm-0" style={{ fontSize: 12 }}>View →</div>
                                    </div>
                                </EdCard>
                            </Link>
                        ) : (
                            <EdCard className="card p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="card-title mb-1" style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
                                        <div className="h3 mb-0" style={{ fontWeight: 700 }}>{s.value}</div>
                                    </div>
                                </div>
                            </EdCard>
                        )}
                    </Col>
                ))}
            </Row>

            <Row>
                <Col xs={12} lg={8} className="mb-3">
                    <EdCard className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Recent Orders</strong>
                                <div className="text-muted" style={{ fontSize: 12 }}>Latest orders</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Link to="/admin/orders"><EdButton size="sm">View all</EdButton></Link>
                            </div>
                        </div>

                        <div className="card-body p-3">
                            <RecentOrdersList recentOrders={recentOrders} loading={loading} />
                        </div>
                    </EdCard>
                </Col>

                <Col xs={12} lg={4} className="mb-3">
                    <EdCard className="card">
                        <div className="card-header"><strong>Top Products</strong></div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                {topProducts.length === 0 ? (
                                    <li className="text-center text-muted py-3">No top products yet</li>
                                ) : topProducts.map((p, idx) => (
                                    <li key={p.id || p.name || idx} className="d-flex justify-content-between align-items-center py-2">
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 6, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                                                #{idx + 1}
                                            </div>
                                            <div style={{ maxWidth: 180 }}>
                                                <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>{p.sold} sold</div>
                                            </div>
                                        </div>
                                        <div className="text-muted" style={{ fontSize: 13 }}>{p.sold}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </EdCard>
                </Col>
            </Row>
        </div>
    );
}

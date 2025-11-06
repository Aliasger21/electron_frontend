import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { BACKEND_API } from "../../config";

function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [productsCount, setProductsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        let mounted = true;
        async function fetchStats() {
            setLoading(true);
            try {
                // products
                const prodRes = await axios.get(`${BACKEND_API}/products`, { params: { page: 1, perPage: 1 } });
                const totalProducts = prodRes.data && prodRes.data.total ? prodRes.data.total : (prodRes.data && prodRes.data.products ? prodRes.data.products.length : 0);

                // users
                const usersRes = await axios.get(`${BACKEND_API}/getsignup`);
                const usersData = usersRes.data && usersRes.data.data && usersRes.data.data.data ? usersRes.data.data.data : (usersRes.data && usersRes.data.data ? usersRes.data.data : []);
                const totalUsers = Array.isArray(usersData) ? usersData.length : 0;

                // orders
                const ordersRes = await axios.get(`${BACKEND_API}/orders`);
                const orders = ordersRes.data && ordersRes.data.orders ? ordersRes.data.orders : [];

                // revenue: only consider orders with status 'completed' (also treat 'paid' as completed)
                const completedStatuses = new Set(['completed', 'paid']);
                const revenueSum = orders.reduce((sum, o) => {
                    const st = (o.status || '').toString().toLowerCase();
                    if (completedStatuses.has(st)) return sum + (Number(o.total) || 0);
                    return sum;
                }, 0);

                // recent orders (take first 6)
                const recent = orders.slice(0, 6);

                // top products by qty across orders
                const counts = {};
                orders.forEach((o) => {
                    (o.items || []).forEach((it) => {
                        const key = it.productname || (it.productId || '').toString();
                        const qty = Number(it.qty) || 0;
                        counts[key] = (counts[key] || 0) + qty;
                    });
                });
                const top = Object.entries(counts)
                    .map(([name, sold]) => ({ name, sold }))
                    .sort((a, b) => b.sold - a.sold)
                    .slice(0, 5);

                if (!mounted) return;
                setProductsCount(totalProducts || 0);
                setUsersCount(totalUsers || 0);
                setOrdersCount(orders.length || 0);
                setRevenue(revenueSum || 0);
                setRecentOrders(recent);
                setTopProducts(top);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchStats();
        return () => { mounted = false; };
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '20px auto', boxSizing: 'border-box' }}>
            <Row className="g-3 mb-3">
                {loading ? (
                    <Col xs={12} className="text-center"><Spinner animation="border" /></Col>
                ) : (
                    <>
                        <Col xs={12} md={6} lg={3}>
                            <Card className="card p-3">
                                <div className="card-title mb-1">Products</div>
                                <div className="h3 mb-0">{productsCount}</div>
                            </Card>
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Card className="card p-3">
                                <div className="card-title mb-1">Orders</div>
                                <div className="h3 mb-0">{ordersCount}</div>
                            </Card>
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Card className="card p-3">
                                <div className="card-title mb-1">Users</div>
                                <div className="h3 mb-0">{usersCount}</div>
                            </Card>
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Card className="card p-3">
                                <div className="card-title mb-1">Revenue</div>
                                <div className="h3 mb-0">${revenue.toFixed(2)}</div>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>

            <Row>
                <Col md={8} className="mb-3">
                    <Card className="card">
                        <Card.Header className="card-header d-flex justify-content-between align-items-center">
                            <span>Recent Orders</span>
                            <Button variant="primary" size="sm">View all</Button>
                        </Card.Header>
                        <Card.Body className="card-body p-0">
                            <Table hover responsive className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o._id || o.id}>
                                            <td>{o._id || o.id}</td>
                                            <td>{(o.customer && (o.customer.name || o.customer.email)) || '—'}</td>
                                            <td>${Number(o.total || 0).toFixed(2)}</td>
                                            <td>{o.status || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="card">
                        <Card.Header className="card-header">Top Products</Card.Header>
                        <Card.Body className="card-body">
                            <ul className="list-unstyled mb-0">
                                {topProducts.length === 0 ? (
                                    <li className="py-2 text-muted">No data</li>
                                ) : (
                                    topProducts.map((p) => (
                                        <li key={p.name} className="d-flex justify-content-between align-items-center py-2">
                                            <span>{p.name}</span>
                                            <span className="text-muted">{p.sold}</span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminDashboard;

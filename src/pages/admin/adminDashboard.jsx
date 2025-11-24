import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import EdCard from "../../components/ui/Card";
import EdButton from "../../components/ui/button";
import { Link } from 'react-router-dom';

function AdminDashboard() {
    const stats = [
        { label: "Products", value: 128 },
        { label: "Orders", value: 54 },
        { label: "Users", value: 24 },
        { label: "Revenue", value: "$12.4k" },
    ];

    const recentOrders = [
        { id: "#1008", customer: "Alice", total: "$120.00", status: "Paid" },
        { id: "#1007", customer: "Bob", total: "$75.50", status: "Pending" },
        { id: "#1006", customer: "Carlos", total: "$210.00", status: "Shipped" },
        { id: "#1005", customer: "Diana", total: "$19.99", status: "Paid" },
    ];

    const topProducts = [
        { name: "Wireless Headphones", sold: 124 },
        { name: "USB-C Charger", sold: 98 },
        { name: "Smartwatch", sold: 76 },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '20px auto', boxSizing: 'border-box' }}>
            <Row className="g-3 mb-3">
                {stats.map((s) => (
                    <Col key={s.label} xs={12} md={6} lg={3}>
                        <EdCard className="card p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="card-title mb-1">{s.label}</div>
                                    <div className="h3 mb-0">{s.value}</div>
                                </div>
                                <div className="text-muted">&nbsp;</div>
                            </div>
                        </EdCard>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col md={8} className="mb-3">
                    <EdCard className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>Recent Orders</span>
                            <Link to="/admin/orders">
                                <EdButton>View all</EdButton>
                            </Link>
                        </div>
                        <div className="card-body p-0">
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
                                        <tr key={o.id}>
                                            <td>{o.id}</td>
                                            <td>{o.customer}</td>
                                            <td>{o.total}</td>
                                            <td>{o.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </EdCard>
                </Col>

                <Col md={4} className="mb-3">
                    <EdCard className="card">
                        <div className="card-header card-header">Top Products</div>
                        <div className="card-body card-body">
                            <ul className="list-unstyled mb-0">
                                {topProducts.map((p) => (
                                    <li key={p.name} className="d-flex justify-content-between align-items-center py-2">
                                        <span>{p.name}</span>
                                        <span className="text-muted">{p.sold}</span>
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

export default AdminDashboard;

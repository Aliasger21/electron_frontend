import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { useState, useEffect } from 'react';
import Loading from '../../components/common/Loading';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${BACKEND_API}/getsignup`, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                let userArray = [];

                if (Array.isArray(response.data)) userArray = response.data;
                else if (response.data?.data?.data && Array.isArray(response.data.data.data)) userArray = response.data.data.data;
                else if (response.data?.data && Array.isArray(response.data.data)) userArray = response.data.data;
                else if (response.data?.users && Array.isArray(response.data.users)) userArray = response.data.users;
                else console.error("Unexpected API response structure:", response.data);

                setUsers(userArray);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Check console for details.");
                setLoading(false);
            });
    }, []);

    if (loading) return <Loading message="Loading users..." />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h3>Manage Users</h3>
            <p>List of registered users ({users.length})</p>
            <Row>
                {users.map((user, i) => (
                    <Col lg={4} md={6} key={user._id || i}>
                        <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', minHeight: 140 }}>
                            <div className="d-flex align-items-start gap-3 p-3">
                                <img
                                    src={user.profilePic || 'https://via.placeholder.com/80'}
                                    alt={user.firstname || user.email}
                                    className="avatar-sm"
                                    style={{ background: '#fff' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>{(user.firstname || '') + (user.lastname ? ' ' + user.lastname : '') || user.email}</div>
                                    <div style={{ color: 'var(--text-muted)', wordBreak: 'break-word' }}>{user.email || 'N/A'}</div>
                                    <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>Phone: {user.phone || 'N/A'}</div>
                                    <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>Address: {user.address || 'N/A'}</div>
                                    <div style={{ color: user.isverify ? 'var(--success)' : 'var(--text-muted)', marginTop: 6 }}>Verified: {user.isverify ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default UsersPage;

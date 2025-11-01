import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useState, useEffect } from 'react';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('useEffect triggered - starting API call');
        axios.get('http://localhost:8888/.netlify/functions/index/Userdata', {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                console.log('API Response:', response);
                let userArray = [];

                if (Array.isArray(response.data)) userArray = response.data;
                else if (response.data?.data?.data && Array.isArray(response.data.data.data)) userArray = response.data.data.data;
                else if (response.data?.data && Array.isArray(response.data.data)) userArray = response.data.data;
                else if (response.data?.users && Array.isArray(response.data.users)) userArray = response.data.users;
                else console.warn("Unexpected data structure:", response.data);

                setUsers(userArray);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Check console for details.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h3>Manage Users</h3>
            <p>List of registered users ({users.length})</p>
            <Row>
                {users.map((user, i) => (
                    <Col lg={3} key={user._id || i}>
                        <Card>
                            <Card.Header>{user.name || user.username || 'N/A'}</Card.Header>
                            <Card.Body>
                                <p>Email: {user.email || 'N/A'}</p>
                                <p>Verified: {user.isverify ? 'Yes' : 'No'}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default UsersPage;

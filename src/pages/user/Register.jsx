import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const res = await axios.post(`${BACKEND_API}/signup`, { firstname, lastname, email, password });
            toast.success('Verification email sent — please check your inbox');
            navigate('/login');
        } catch (err) {
            console.error(err);
            const status = err?.response?.status;
            const msg = err?.response?.data?.data?.message || err?.response?.data?.message;
            if (status === 409) {
                toast.info(msg || 'Email already registered. Redirecting to login...');
                navigate('/login');
            } else {
                toast.error('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 style={{ color: '#fff' }}>Register</h3>
                    <Form onSubmit={submit} className="mt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button type="submit" style={{ backgroundColor: 'var(--accent)', border: 'none' }} disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;



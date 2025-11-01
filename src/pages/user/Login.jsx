import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8888/.netlify/functions/index/loginsignup', { email, password });
            // backend returns: { status: true, data: { message, data: userObj, token } }
            const payload = res.data && res.data.data ? res.data.data : {};
            const token = payload.token || res.data.token;
            const userObj = payload.data || payload.user || null;
            if (token) localStorage.setItem('token', token);
            if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
            // notify header of auth change
            window.dispatchEvent(new Event('authChanged'));
            toast.success('Logged in');
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
            if (err?.response?.status === 403 && msg && msg.toLowerCase().includes('verify')) {
                toast.error('Email not verified. Please verify first.');
            } else if (err?.response?.status === 404) {
                toast.info('Email not registered. Redirecting to registration...');
                navigate('/register');
            } else {
                toast.error('Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const resendVerification = async () => {
        if (!email) { toast.info('Enter your email above to resend verification'); return; }
        try {
            await axios.post('http://localhost:8888/.netlify/functions/index/resend-verification', { email });
            toast.success('Verification email resent');
        } catch (err) {
            console.error(err);
            toast.error('Failed to resend verification');
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 style={{ color: '#fff' }}>Login</h3>
                    <Form onSubmit={submit} className="mt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button type="submit" style={{ backgroundColor: 'var(--accent)', border: 'none' }} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <div className="mt-3" style={{ color: 'var(--text-muted)' }}>
                            New here? <a href="/register">Create an account</a>
                        </div>
                        <div className="mt-2" style={{ color: 'var(--text-muted)' }}>
                            Didn't receive verification? <a role="button" onClick={resendVerification} style={{ cursor: 'pointer', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Resend verification</a>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;



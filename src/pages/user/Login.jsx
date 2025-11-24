// src/pages/user/Login.jsx
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import EdButton from '../../components/ui/button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

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
            const res = await axiosInstance.post(`/loginsignup`, { email, password });
            const payload = res.data && res.data.data ? res.data.data : {};
            const token = payload.token || res.data.token;
            const userObj = payload.data || payload.user || null;
            if (token) localStorage.setItem('token', token);
            if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
            window.dispatchEvent(new Event('authChanged'));
            toast.success('Logged in');
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
            if (err?.response?.status === 403 && msg && msg.toLowerCase().includes('verify')) {
                toast.error('Email not verified. Please verify first.');
                navigate('/verify-otp');
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
            await axiosInstance.post(`/resend-verification`, { email });
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
                    <Card>
                        <h3 className="text-white fw-bold">Login</h3>
                        <Form onSubmit={submit} className="mt-3">
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                            <div>
                                <EdButton type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</EdButton>
                            </div>

                            <div className="mt-3 text-muted">
                                New here? <a href="/register">Create an account</a>
                            </div>

                            <div className="mt-2 text-muted">
                                <a href="/forgot-password" className="text-primary text-decoration-underline fw-semibold">
                                    Forgot password?
                                </a>
                            </div>

                            <div className="mt-2 text-muted">
                                Didn't receive verification? <a role="button" onClick={resendVerification} className="text-primary text-decoration-underline fw-semibold" style={{ cursor: 'pointer' }}>Resend verification</a>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

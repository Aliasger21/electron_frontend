// src/pages/user/Register.jsx
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
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

        // Save pre-register creds so VerifyOTP can auto-login after verification.
        // This is removed by VerifyOTP after successful auto-login.
        try {
            localStorage.setItem('preRegisterCreds', JSON.stringify({ email, password }));
        } catch (err) {
            // ignore storage errors
            console.warn('Failed to save preRegisterCreds', err);
        }

        try {
            // use axiosInstance which has BACKEND_API as baseURL and auto-attaches token if present
            const res = await axiosInstance.post(`/signup`, { firstname, lastname, email, password });
            // success: backend will send OTP email now
            toast.success('Verification OTP sent — please check your email');
            // navigate to verify page where user will enter OTP
            navigate('/verify');
        } catch (err) {
            console.error(err);
            // clean up preRegisterCreds on error so we don't try auto-login for failed attempts
            try { localStorage.removeItem('preRegisterCreds'); } catch { }

            const status = err?.response?.status;
            const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
            if (status === 409) {
                toast.info(msg || 'Email already registered. Try logging in.');
                navigate('/login');
            } else {
                toast.error(msg || 'Registration failed');
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
                        <Button type="submit" className="btn-accent" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;

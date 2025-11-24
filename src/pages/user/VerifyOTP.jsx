// src/pages/user/VerifyOTP.jsx
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (verifying) return;
        setVerifying(true);
        try {
            await axiosInstance.post(`/verify-otp`, { email, otp });
            toast.success('Email verified successfully');

            // attempt auto-login if we have pre-registered creds
            try {
                const pre = localStorage.getItem('preRegisterCreds');
                if (pre) {
                    const creds = JSON.parse(pre);
                    if (creds.email === email && creds.password) {
                        const res = await axiosInstance.post(`/loginsignup`, { email: creds.email, password: creds.password });
                        const payload = res.data && res.data.data ? res.data.data : {};
                        const token = payload.token || res.data.token;
                        const userObj = payload.data || payload.user || null;
                        if (token) localStorage.setItem('token', token);
                        if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
                        // clear preRegisterCreds
                        localStorage.removeItem('preRegisterCreds');
                        window.dispatchEvent(new Event('authChanged'));
                        toast.success('Logged in automatically');
                        navigate('/');
                        return;
                    }
                }
            } catch (e) {
                // ignore auto-login failure
            }

            // otherwise redirect to login
            navigate('/login');
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
            toast.error(msg || 'Failed to verify OTP');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 style={{ color: '#fff' }}>Verify Email (OTP)</h3>
                    <Form onSubmit={submit} className="mt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>OTP</Form.Label>
                            <Form.Control type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        </Form.Group>
                        <Button type="submit" className="btn-accent" disabled={verifying}>
                            {verifying ? 'Verifying...' : 'Verify'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default VerifyOTP;

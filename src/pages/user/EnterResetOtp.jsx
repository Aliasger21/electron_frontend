// src/pages/user/EnterResetOtp.jsx
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const EnterResetOtp = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [verifying, setVerifying] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // email might be passed via state from ForgotPassword
    useState(() => {
        if (location.state && location.state.email) setEmail(location.state.email);
    });

    const submit = async (e) => {
        e.preventDefault();
        if (verifying) return;
        if (!email) { toast.info('Please enter your email'); return; }
        setVerifying(true);
        try {
            // We don't have a dedicated "verify reset OTP" endpoint on backend,
            // but resetPassword endpoint will validate OTP when changing password.
            // Here we just move to NewPassword with email and otp.
            navigate('/reset-password', { state: { email, otp } });
        } catch (err) {
            console.error(err);
            toast.error('Failed to verify OTP');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 style={{ color: '#fff' }}>Enter Reset OTP</h3>
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
                            {verifying ? 'Proceeding...' : 'Proceed to reset password'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EnterResetOtp;

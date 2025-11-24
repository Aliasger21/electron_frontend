// src/pages/user/ForgotPassword.jsx
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);
        try {
            await axiosInstance.post(`/forgot-password`, { email });
            toast.success('Password reset OTP sent to your email');
            // navigate to enter OTP page and pass email via state or query
            navigate('/enter-reset-otp', { state: { email } });
        } catch (err) {
            console.error(err);
            toast.error('Failed to send reset OTP');
        } finally {
            setSending(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 style={{ color: '#fff' }}>Forgot Password</h3>
                    <Form onSubmit={submit} className="mt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Enter your registered email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Button type="submit" className="btn-accent" disabled={sending}>
                            {sending ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;

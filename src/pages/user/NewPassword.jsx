// src/pages/user/NewPassword.jsx
import { Container, Row, Col, Form } from 'react-bootstrap';
import EdButton from '../../components/ui/button';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const NewPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        if (!email || !otp) { toast.info('Email and OTP are required'); return; }
        setSubmitting(true);
        try {
            await axiosInstance.post(`/reset-password`, { email, otp, newPassword });
            toast.success('Password reset successful. Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
            toast.error(msg || 'Failed to reset password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3 style={{ color: '#fff' }}>Set New Password</h3>
                    <Form onSubmit={submit} className="mt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </Form.Group>
                        <EdButton type="submit" disabled={submitting}>
                            {submitting ? 'Resetting...' : 'Reset Password'}
                        </EdButton>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default NewPassword;

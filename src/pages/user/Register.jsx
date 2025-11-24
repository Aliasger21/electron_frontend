// src/pages/user/Register.jsx
import { Container, Row, Col, Form } from 'react-bootstrap';
import EdButton from '../../components/ui/button';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { DEFAULT_AVATAR_URL } from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';

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
            localStorage.setItem('preRegisterCreds', JSON.stringify({ email, password }));
        } catch (err) {
            console.warn('Failed to save preRegisterCreds', err);
        }

        try {
            // Provide a default profile picture unless the user uploads one later
            await axiosInstance.post(`/signup`, { firstname, lastname, email, password, profilePic: DEFAULT_AVATAR_URL });
            toast.success('Verification OTP sent — please check your email');
            navigate('/verify');
        } catch (err) {
            console.error(err);
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
                    <Card>
                        <h3 style={{ color: '#fff' }}>Register</h3>
                        <Form onSubmit={submit} className="mt-3">
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Input value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Input value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                            <div>
                                <EdButton type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</EdButton>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;

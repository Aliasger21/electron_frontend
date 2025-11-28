import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';
import { Container, Row, Col } from 'react-bootstrap';

export default function LegacyVerifyRedirect() {
    const [qs] = useSearchParams();
    const navigate = useNavigate();
    const [busy, setBusy] = useState(true);

    useEffect(() => {
        const token = qs.get('token');
        const email = qs.get('email'); // some legacy links might include email

        // If token exists — attempt to verify via backend old endpoint
        if (token) {
            const backendVerify = `${BACKEND_API}/verify-email?token=${encodeURIComponent(token)}`;

            (async () => {
                try {
                    // try AJAX first so we can show a React toast & route
                    const res = await axios.get(backendVerify, { validateStatus: () => true });

                    if (res && (res.status === 200 || res.status === 201)) {
                        toast.success('Email verified');
                        setBusy(false);
                        navigate('/verify-success');
                        return;
                    }

                    // server returned JSON message (handle gracefully)
                    if (res && res.data && (res.data.message || res.data.error)) {
                        const msg = res.data.message || res.data.error;
                        toast.info(msg);
                        setBusy(false);
                        if (res.status >= 400 && res.status < 500) navigate('/verify-success'); // or a failed page you use
                        else navigate('/');
                        return;
                    }

                    // fallback to full page redirect if AJAX doesn't do the job
                    window.location.href = backendVerify;
                } catch (err) {
                    console.error('Legacy verify AJAX error:', err);
                    try {
                        window.location.href = backendVerify;
                    } catch (redirErr) {
                        console.error('Fallback redirect failed', redirErr);
                        toast.error('Verification failed');
                        navigate('/');
                    }
                } finally {
                    setBusy(false);
                }
            })();

            return;
        }

        // No token -> treat as user intent to use new OTP flow.
        // If email query param exists, forward it, otherwise just go to /verifyOTP
        if (email) {
            navigate(`/verifyOTP?email=${encodeURIComponent(email)}`);
        } else {
            navigate('/verifyOTP');
        }
    }, [qs, navigate]);

    return (
        <Container className="py-5 text-center">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Loading message="Processing verification..." />
                </Col>
            </Row>
        </Container>
    );
}

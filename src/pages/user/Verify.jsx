import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';
import { Container, Row, Col } from 'react-bootstrap';

const Verify = () => {
  const [qs] = useSearchParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const token = qs.get('token');

    if (!token) {
      toast.error('Invalid verification link');
      navigate('/');
      return;
    }

    const backendVerify = `${BACKEND_API}/verify-email?token=${encodeURIComponent(token)}`;

    (async () => {
      try {
        // Try AJAX first (works when backend returns JSON/200)
        const res = await axios.get(backendVerify, { validateStatus: () => true }); // let us inspect status
        // If backend returns a JSON 200/201, treat as success
        if (res && (res.status === 200 || res.status === 201)) {
          toast.success('Email verified');
          setBusy(false);
          navigate('/verify-success');
          return;
        }

        // If backend returned a 3xx/4xx/5xx JSON with message, show it
        if (res && res.data && (res.data.message || res.data.error || res.data.msg)) {
          const msg = res.data.message || res.data.error || res.data.msg;
          toast.info(msg);
          setBusy(false);
          // Sometimes backend returns 302 and also JSON — if backend wants full browser redirect it may not send 200
          // Redirect to success or login depending on status
          if (res.status >= 400 && res.status < 500) navigate('/verify-failed');
          else navigate('/');
          return;
        }

        // Fallback: If AJAX didn't give a clear success, try full-page redirect (some backends expect this)
        window.location.href = backendVerify;
      } catch (err) {
        console.error('Verify AJAX error:', err);

        // If request failed due to CORS / network, fallback to full-page redirect
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Minimal UI during the process
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={6}>
          {busy ? (
            <Loading message="Verifying your email..." />
          ) : (
            <div style={{ color: '#fff' }}>
              <h4>Verification in progress</h4>
              <p>If you are not redirected, <a href="/">go home</a>.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Verify;

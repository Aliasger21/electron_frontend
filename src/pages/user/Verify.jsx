import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { toast } from 'react-toastify';

const Verify = () => {
  const [qs] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = qs.get('token');
    if (!token) {
      toast.error('Invalid verification link');
      navigate('/');
      return;
    }

    const backendVerify = `${BACKEND_API}/verify-email?token=${token}`;

    (async () => {
      try {
        // Try AJAX first (works when backend returns JSON/200)
        const res = await axios.get(backendVerify);
        if (res && (res.status === 200 || res.status === 201)) {
          toast.success('Email verified');
          navigate('/verify-success');
          return;
        }
      } catch (err) {
        // if AJAX fails (e.g. backend does redirect/302), fallback to full-page redirect
        try {
          window.location.href = backendVerify;
        } catch (redirErr) {
          console.error('Fallback redirect failed', redirErr);
          toast.error('Verification failed');
          navigate('/');
        }
      }
    })();
  }, []);

  return null;
};

export default Verify;



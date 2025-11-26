import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import EdButton from '../../components/ui/button';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const passwordRules = [
  { id: 'len', label: 'At least 8 characters', test: (s) => s.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (s) => /[A-Z]/.test(s) },
  { id: 'lower', label: 'One lowercase letter', test: (s) => /[a-z]/.test(s) },
  { id: 'digit', label: 'One number', test: (s) => /[0-9]/.test(s) },
  { id: 'special', label: 'One special character', test: (s) => /[^A-Za-z0-9]/.test(s) },
];

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const validation = useMemo(() => {
    const results = passwordRules.map((r) => ({ ...r, ok: r.test(newPassword) }));
    return { results, allOk: results.every((r) => r.ok) };
  }, [newPassword]);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!email || !otp) {
      toast.info('Email and OTP are required');
      return;
    }
    if (!validation.allOk) {
      toast.info('Please fix password issues before submitting');
      return;
    }
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
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    background: 'transparent',
                    border: 'none',
                    padding: 6,
                    cursor: 'pointer',
                    color: '#666',
                  }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                {validation.results.map((r) => (
                  <div key={r.id} style={{ color: r.ok ? '#8ee' : '#f66', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <small>{r.ok ? '✓' : '•'}</small>
                    <small>{r.label}</small>
                  </div>
                ))}
              </div>
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

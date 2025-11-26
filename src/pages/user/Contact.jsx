// src/pages/user/Contact.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/LoadingContext';
import EdButton from '../../components/ui/button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { showLoading, hideLoading } = useLoading();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('All fields are required');
    try {
      if (showLoading) showLoading('Sending message...');
      await axiosInstance.post('/contact', form);
      toast.success('Message sent — we will contact you shortly');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
      toast.error(msg || 'Failed to send message');
    } finally {
      try { if (hideLoading) hideLoading(); } catch { }
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <h2 style={{ color: '#fff' }}>Contact Us</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Have questions or need help? Send us a message and our support team will get back to you.
            </p>

            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-3">
                <label style={{ color: 'var(--text-muted)' }}>Name</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label style={{ color: 'var(--text-muted)' }}>Email</label>
                <Input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label style={{ color: 'var(--text-muted)' }}>Message</label>
                <textarea
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="ed-input"
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <EdButton type="submit">Send Message</EdButton>
              </div>
            </form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;

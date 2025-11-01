import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_API } from '../../config';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/LoadingContext';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { showLoading, hideLoading } = useLoading();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('All fields are required');
    try {
      showLoading('Sending message...');
      await axios.post(`${BACKEND_API}/contact`, form);
      toast.success('Message sent — we will contact you shortly');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    } finally { hideLoading(); }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 style={{ color: '#fff' }}>Contact Us</h2>
          <p style={{ color: 'var(--text-muted)' }}>Have questions or need help? Send us a message and our support team will get back to you.</p>
          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={6} name="message" value={form.message} onChange={handleChange} required />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" style={{ backgroundColor: 'var(--accent)', border: 'none' }}>Send Message</Button>
              <Button variant="outline-light" href="mailto:support@electron.store">Email Support</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;



import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null } catch { return null }
  });
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', phone: '', address: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        const res = await axios.post('http://localhost:8888/.netlify/functions/index/authverify', {}, { headers: { Authorization: token } });
        // backend returns { status: true, data: { message, data: user } }
        const u = res.data?.data?.data || res.data?.data || res.data;
        if (u) {
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
          setForm({ firstname: u.firstname || '', lastname: u.lastname || '', email: u.email || '', phone: u.phone || '', address: u.address || '' });
          setPreview(u.profilePic || '');
        }
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { toast.info('Please login'); navigate('/login'); return; }
    try {
      // update fields
      const res = await axios.put(`http://localhost:8888/.netlify/functions/index/updatesignup/${user._id}`, form, { headers: { Authorization: token } });
      // upload file if any
      if (file) {
        const fd = new FormData(); fd.append('file', file);
        const r2 = await axios.post(`http://localhost:8888/.netlify/functions/index/updatesignup/${user._id}/photo`, fd, { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } });
        form.profilePic = r2.data.data.profilePic;
      }
      const updatedUser = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This is permanent.')) return;
    const token = localStorage.getItem('token');
    if (!token) { toast.info('Please login'); navigate('/login'); return; }
    try {
      await axios.delete(`http://localhost:8888/.netlify/functions/index/deletesignup/${user._id}`, { headers: { Authorization: token } });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Account deleted');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account');
    }
  };

  if (!user) return (
    <Container className="py-5 text-center"><p style={{ color: '#fff' }}>Please login to edit profile.</p></Container>
  );

  return (
    <Container className="py-5">
      <Row>
        <Col md={4} className="text-center">
          <div style={{ width: 200, height: 200, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 10 }}>
            <Image src={preview || 'https://via.placeholder.com/180'} rounded style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <Form.Group className="mt-3">
            <Form.Label style={{ color: 'var(--text)' }}>Change Profile Picture</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFile} />
          </Form.Group>
        </Col>
        <Col md={8}>
          <h3 style={{ color: '#fff' }}>Edit Profile</h3>
          <Form className="mt-3" onSubmit={handleSave}>
            <Row className="g-3">
              <Col md={6}><Form.Control name="firstname" value={form.firstname} onChange={handleChange} placeholder="First name" required /></Col>
              <Col md={6}><Form.Control name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last name" required /></Col>
              <Col md={12}><Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required /></Col>
              <Col md={6}><Form.Control name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" /></Col>
              <Col md={6}><Form.Control as="textarea" rows={5} name="address" value={form.address} onChange={handleChange} placeholder="Address" /></Col>
            </Row>
            <div className="mt-3">
              <Button type="submit" style={{ backgroundColor: 'var(--accent)', border: 'none' }}>Save Profile</Button>
              <Button variant="outline-light" className="ms-2" onClick={handleDeleteAccount}>Delete Account</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;



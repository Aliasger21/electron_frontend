// src/pages/user/Profile.jsx
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';

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
        const res = await axiosInstance.post(`/authverify`, {}); // axiosInstance will attach token
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
      const res = await axiosInstance.put(`/updatesignup/${user._id}`, form);
      // upload file if any
      if (file) {
        const fd = new FormData(); fd.append('file', file);
        const r2 = await axiosInstance.post(`/updatesignup/${user._id}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await axiosInstance.delete(`/deletesignup/${user._id}`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Account deleted');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // -------------------- Change password UI --------------------
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) { toast.info('Enter old and new password'); return; }
    setChanging(true);
    try {
      await axiosInstance.post(`/profile/change-password`, { oldPassword, newPassword });
      toast.success('Password updated');
      setOldPassword('');
      setNewPassword('');
      setShowChangePassword(false);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
      toast.error(msg || 'Failed to update password');
    } finally {
      setChanging(false);
    }
  };

  if (!user) return (
    <Container className="py-5 text-center"><p style={{ color: '#fff' }}>Please login to edit profile.</p></Container>
  );

  return (
    <Container className="py-5">
      <Row>
        <Col md={4} className="text-center">
          <div className="avatar-preview">
            <img src={preview || 'https://via.placeholder.com/180'} alt="profile" />
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
              <Button type="submit" className="btn-accent">Save Profile</Button>
              <Button variant="outline-light" className="ms-2" onClick={handleDeleteAccount}>Delete Account</Button>
              <Button variant="outline-light" className="ms-2" onClick={() => setShowChangePassword(!showChangePassword)}>Change Password</Button>
            </div>
          </Form>

          {showChangePassword && (
            <Form className="mt-3" onSubmit={handleChangePassword}>
              <h5 style={{ color: '#fff', marginTop: 20 }}>Change Password</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Control type="password" placeholder="Old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                </Col>
                <Col md={6}>
                  <Form.Control type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </Col>
              </Row>
              <div className="mt-3">
                <Button type="submit" className="btn-accent" disabled={changing}>{changing ? 'Updating...' : 'Update Password'}</Button>
              </div>
            </Form>
          )}

        </Col>
      </Row>
      <ConfirmModal
        show={showDeleteConfirm}
        title="Delete account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
};

export default Profile;

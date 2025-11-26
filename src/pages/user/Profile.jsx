import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

import EdButton from "../../components/ui/button";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import LoadingOverlay from '../../components/ui/LoadingOverlay';

import "./Profile.css";

const AVATAR_FALLBACK = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
  <rect width='100%' height='100%' fill='%23f3f3f3'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='18'>Avatar</text>
</svg>`;

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const passwordRulesProfile = [
  { id: 'len', label: 'At least 8 characters', test: (s) => s.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (s) => /[A-Z]/.test(s) },
  { id: 'lower', label: 'One lowercase letter', test: (s) => /[a-z]/.test(s) },
  { id: 'digit', label: 'One number', test: (s) => /[0-9]/.test(s) },
  { id: 'special', label: 'One special character', test: (s) => /[^A-Za-z0-9]/.test(s) },
];

const Profile = () => {
  const navigate = useNavigate();

  // init from localStorage so first render has values
  const storedUser = readStoredUser();
  const [user, setUser] = useState(storedUser);
  const [form, setForm] = useState({
    firstname: storedUser?.firstname || "",
    lastname: storedUser?.lastname || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
  });
  const [preview, setPreview] = useState(storedUser?.profilePic || AVATAR_FALLBACK);
  const [file, setFile] = useState(null);

  // show skeleton while fetching authoritative profile
  const [loading, setLoading] = useState(Boolean(!storedUser));

  // saving state for profile updates
  const [saving, setSaving] = useState(false);

  // saved state for button success feedback
  const [saved, setSaved] = useState(false);

  // change-password states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // sync from localStorage (used on authChanged and storage events)
  const syncFromStorage = useCallback(() => {
    const u = readStoredUser();
    if (!u) return;
    setUser(u);
    setForm({
      firstname: u.firstname || "",
      lastname: u.lastname || "",
      email: u.email || "",
      phone: u.phone || "",
      address: u.address || "",
    });
    setPreview(u.profilePic || AVATAR_FALLBACK);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token → user not logged in → stop loading
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.post("/authverify", {});
        // your backend ALWAYS returns user here:
        const u = res?.data?.data?.data;

        if (u) {
          // update localStorage
          localStorage.setItem("user", JSON.stringify(u));

          // update UI
          setUser(u);
          setForm({
            firstname: u.firstname || "",
            lastname: u.lastname || "",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
          });
          setPreview(u.profilePic || AVATAR_FALLBACK);

          // notify other components
          window.dispatchEvent(new Event("authChanged"));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  // listen to authChanged (login/logout)
  useEffect(() => {
    window.addEventListener("authChanged", syncFromStorage);
    return () => window.removeEventListener("authChanged", syncFromStorage);
  }, [syncFromStorage]);

  // listen to storage (other tabs or writes)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") setTimeout(syncFromStorage, 0);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [syncFromStorage]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch { }
      }
    };
  }, [preview]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (preview && preview.startsWith("blob:")) {
      try { URL.revokeObjectURL(preview); } catch { }
    }

    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(user?.profilePic || AVATAR_FALLBACK);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.info("Please login"); navigate("/login"); return; }
    if (!user) { toast.error("User not loaded"); return; }
    if (saving) return;

    setSaving(true);
    try {
      await axiosInstance.put(`/updatesignup/${user._id}`, form);
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const r2 = await axiosInstance.post(`/updatesignup/${user._id}/photo`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newPic = r2?.data?.data?.profilePic || r2?.data?.profilePic || r2?.data;
        if (newPic) {
          form.profilePic = newPic;
          setPreview(newPic);
        }
      }
      const updatedUser = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("authChanged"));
      toast.success("Profile updated");

      // show success state on button briefly
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      const serverMsg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
      toast.error(serverMsg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDeleteAccount = () => setShowDeleteConfirm(true);

  const confirmDeleteAccount = async () => {
    if (!user) { toast.error("User not available"); setShowDeleteConfirm(false); return; }
    try {
      await axiosInstance.delete(`/deletesignup/${user._id}`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));
      toast.success("Account deleted");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) { toast.info("Enter old and new password"); return; }
    if (changing) return;

    // validate new password locally
    const results = passwordRulesProfile.map(r => ({ ...r, ok: r.test(newPassword) }));
    const allOk = results.every(r => r.ok);
    if (!allOk) { toast.info('Please fix new password issues before submitting'); return; }

    setChanging(true);
    try {
      await axiosInstance.post("/profile/change-password", { oldPassword, newPassword });
      toast.success("Password updated");
      setOldPassword("");
      setNewPassword("");
      setShowChangePassword(false);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
      toast.error(msg || "Failed to update password");
    } finally {
      setChanging(false);
    }
  };

  const validationNewPass = useMemo(() => passwordRulesProfile.map(r => ({ ...r, ok: r.test(newPassword) })), [newPassword]);

  if (!user && !loading) {
    return (
      <Container className="py-5 text-center">
        <p style={{ color: "#fff" }}>Please login to edit profile.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <LoadingOverlay show={saving || changing} message={changing ? "Updating password..." : "Saving profile..."} />

      {/* Scoped responsive styles for avatar preview + small layout tweaks and button styles */}
      <style>{`
        .avatar-preview {
          width: 180px;
          max-width: 40vw;
          aspect-ratio: 1 / 1;
          background: #fff;
          border-radius: 12px;
          padding: 6px;
          box-sizing: border-box;
          margin: 0 auto;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 8px;
        }

        @media (max-width: 576px) {
          .avatar-preview { width: 34vw; max-width: 140px; padding: 6px; }
        }

        .profile-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

        @media (max-width: 480px) {
          .profile-actions { flex-direction: column; align-items: stretch; }
          .profile-actions .ed-btn, .profile-actions .btn { width: 100%; }
        }

        .profile-actions .ed-btn, .profile-actions .btn {
          transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-weight: 600;
        }
        .profile-btn { font-weight: 600; }
        .profile-btn-danger {
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.06);
          background: transparent;
        }
        .profile-btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          background: rgba(255,255,255,0.04);
        }

        .ed-btn--success {
          background: var(--success) !important;
          color: #000 !important;
          border: none !important;
          box-shadow: 0 6px 18px rgba(56,176,0,0.18) !important;
        }

        .profile-btn-save {
          background: #28c76f !important;
          color: #000 !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(40,199,111,0.25) !important;
        }

        .profile-btn-save:hover {
          transform: translateY(-2px);
          background: #22b463 !important;
        }

        .ed-btn:hover { transform: translateY(-2px); }
      `}</style>

      <Row>
        <Col md={4} className="text-center mb-4 mb-md-0">
          <Card className="text-center">
            <div className="avatar-preview" style={{ marginBottom: 12 }}>
              {loading ? (
                <Skeleton variant="avatar" />
              ) : (
                <img src={preview || AVATAR_FALLBACK} alt="profile" />
              )}
            </div>
            <Form.Group className="mt-3 px-2">
              <Form.Label style={{ color: "var(--text)" }}>Change Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFile} />
            </Form.Group>
          </Card>
        </Col>

        <Col md={8}>
          <h3 style={{ color: "#fff" }}>Edit Profile</h3>

          <Form className="mt-3" onSubmit={handleSave}>
            <Row className="g-3">
              <Col md={6}>
                {loading ? (
                  <Skeleton height="2.4rem" className="w-100 mb-3" />
                ) : (
                  <Form.Control name="firstname" value={form.firstname} onChange={handleChange} placeholder="First name" required />
                )}
              </Col>

              <Col md={6}>
                {loading ? (
                  <Skeleton height="2.4rem" className="w-100 mb-3" />
                ) : (
                  <Form.Control name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last name" required />
                )}
              </Col>

              <Col md={12}>
                {loading ? (
                  <Skeleton height="2.4rem" className="w-100 mb-3" />
                ) : (
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                )}
              </Col>

              <Col md={6}>
                {loading ? <Skeleton height="2.4rem" className="w-100 mb-3" /> : <Form.Control name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />}
              </Col>

              <Col md={6}>
                {loading ? (
                  <Skeleton height="6rem" className="w-100 mb-3" />
                ) : (
                  <Form.Control as="textarea" rows={5} name="address" value={form.address} onChange={handleChange} placeholder="Address" />
                )}
              </Col>
            </Row>

            <div className="mt-3 profile-actions">
              {loading ? (
                <>
                  <Skeleton width="140px" height="40px" className="me-2" />
                  <Skeleton width="140px" height="40px" className="me-2" />
                  <Skeleton width="140px" height="40px" />
                </>
              ) : (
                <>
                  <EdButton
                    type="submit"
                    className={`me-2 profile-btn ${saved ? 'ed-btn--success' : 'profile-btn-save'}`}
                    disabled={saved || saving}
                  >
                    {saved ? "Success" : saving ? "Saving..." : "Save Profile"}
                  </EdButton>

                  <EdButton
                    type="button"
                    className="me-2 profile-btn profile-btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={saving || changing}
                  >
                    Delete Account
                  </EdButton>

                  <EdButton type="button" className="profile-btn" onClick={() => setShowChangePassword(!showChangePassword)} disabled={saving || changing}>
                    Change Password
                  </EdButton>
                </>
              )}
            </div>
          </Form>

          {showChangePassword && (
            <Form className="mt-3" onSubmit={handleChangePassword}>
              <h5 style={{ color: "#fff", marginTop: 20 }}>Change Password</h5>
              <Row className="g-3">
                <Col md={6}>
                  <div style={{ position: 'relative' }}>
                    <Form.Control placeholder="Old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required type={showOld ? 'text' : 'password'} />
                    <button type="button" onClick={() => setShowOld(s => !s)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', color: '#666' }} aria-label={showOld ? 'Hide old password' : 'Show old password'}>
                      {showOld ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ position: 'relative' }}>
                    <Form.Control placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type={showNew ? 'text' : 'password'} />
                    <button type="button" onClick={() => setShowNew(s => !s)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', color: '#666' }} aria-label={showNew ? 'Hide new password' : 'Show new password'}>
                      {showNew ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {validationNewPass.map(r => (
                      <div key={r.id} style={{ color: r.ok ? '#8ee' : '#f66', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <small>{r.ok ? '✓' : '•'}</small>
                        <small>{r.label}</small>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
              <div className="mt-3">
                <EdButton type="submit" className="profile-btn" disabled={changing || saving}>{changing ? "Updating..." : "Update Password"}</EdButton>
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

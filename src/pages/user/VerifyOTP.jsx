import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import EdButton from "../../components/ui/button";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { saveUserToLocal, setToken } from "../../utils/authHelpers";
import LoadingOverlay from '../../components/ui/LoadingOverlay';

function tryExtractToken(res) {
  if (!res) return null;
  const d = res?.data ?? {};
  return (
    d.token ||
    d.authToken ||
    d.data?.token ||
    d.data?.authToken ||
    d.data?.data?.token ||
    res?.headers?.authorization ||
    res?.headers?.Authorization ||
    null
  );
}

function tryExtractUser(res) {
  if (!res) return null;
  const d = res?.data ?? {};
  return (
    d.user ||
    d.data?.user ||
    d.data?.data?.user ||
    d.data?.data ||
    d.data ||
    d ||
    null
  );
}

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qEmail = params.get("email") || "";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (qEmail) {
      setEmail(qEmail);
      return;
    }
    try {
      const pre = localStorage.getItem("preRegisterCreds");
      if (pre) {
        const creds = JSON.parse(pre);
        if (creds?.email) {
          setEmail(creds.email);
          return;
        }
      }
    } catch (e) { /* ignore */ }

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.email) setEmail(u.email);
      }
    } catch (e) { /* ignore */ }
  }, [qEmail]);

  const submit = async (e) => {
    e.preventDefault();
    if (verifying) return;
    if (!email || !otp) {
      toast.info("Enter email and OTP");
      return;
    }

    setVerifying(true);
    try {
      // Verify OTP
      const verifyRes = await axiosInstance.post("/verify-otp", { email, otp });
      toast.success("Email verified successfully");

      // Try to extract token & user
      let token = tryExtractToken(verifyRes);
      let userObj = tryExtractUser(verifyRes);

      if (token) setToken(token);
      if (userObj && typeof userObj === "object") {
        if (userObj.user) userObj = userObj.user;
        saveUserToLocal(userObj);
      }

      // If no token was returned, attempt login using preRegisterCreds (optional fallback)
      if (!token) {
        try {
          const pre = localStorage.getItem("preRegisterCreds");
          if (pre) {
            const creds = JSON.parse(pre);
            if (creds?.email === email && creds?.password) {
              const loginRes = await axiosInstance.post("/loginsignup", { email: creds.email, password: creds.password });
              token = token || tryExtractToken(loginRes);
              userObj = userObj || tryExtractUser(loginRes);
              if (token) setToken(token);
              if (userObj && typeof userObj === "object") {
                if (userObj.user) userObj = userObj.user;
                saveUserToLocal(userObj);
              }
            }
          }
        } catch (autoErr) {
          console.warn("Auto-login failed", autoErr);
        }
      }

      // If token present but user missing, fetch profile via authverify
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const currentToken = localStorage.getItem("token");
      if (currentToken && !currentUser) {
        try {
          const av = await axiosInstance.post("/authverify", {});
          const u = av?.data?.data?.data || av?.data?.data || av?.data || av;
          if (u) saveUserToLocal(u);
        } catch (e) {
          console.warn("authverify failed:", e);
        }
      }

      // Finalize
      const finalToken = localStorage.getItem("token");
      if (finalToken) {
        try { localStorage.removeItem("preRegisterCreds"); } catch { }
        try { window.dispatchEvent(new Event("authChanged")); } catch { }
        toast.success("Logged in");
        navigate("/");
        return;
      }

      // Otherwise send to login
      navigate("/login");
    } catch (err) {
      console.error("verify error:", err);
      const msg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to verify OTP";
      toast.error(typeof msg === "string" ? msg : "Failed to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      toast.info("Enter email first");
      return;
    }
    if (resending) return;
    setResending(true);
    try {
      const res = await axiosInstance.post("/resend-otp", { email });
      const msg = res?.data?.data?.message || res?.data?.message || "OTP resent";
      toast.success(msg);
    } catch (err) {
      console.error("resend-otp error:", err);
      const msg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend OTP";
      toast.error(typeof msg === "string" ? msg : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <Container className="py-5">
      <LoadingOverlay show={verifying} message="Verifying..." />
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 style={{ color: "#fff" }}>Verify Email (OTP)</h3>
          <Form onSubmit={submit} className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>OTP</Form.Label>
              <Form.Control type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </Form.Group>

            <div className="d-flex gap-2">
              <EdButton type="submit" disabled={verifying}>
                {verifying ? "Verifying..." : "Verify"}
              </EdButton>
              <Button variant="outline-light" onClick={resendOtp} disabled={resending}>
                {resending ? "Resending..." : "Resend OTP"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

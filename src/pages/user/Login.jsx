import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import EdButton from "../../components/ui/button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import LoadingOverlay from '../../components/ui/LoadingOverlay';

import { saveUserToLocal, setToken } from "../../utils/authHelpers";

const tryExtractToken = (res) => {
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
};

const tryExtractUser = (res) => {
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
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axiosInstance.post("/loginsignup", { email, password });

      const token = tryExtractToken(res);
      let userObj = tryExtractUser(res);

      if (token) setToken(token);

      if (userObj && typeof userObj === "object") {
        if (userObj.user) userObj = userObj.user;
        saveUserToLocal(userObj);
      } else if (token) {
        // try to fetch authoritative profile if login didn't return user
        try {
          const av = await axiosInstance.post("/authverify", {});
          const u = av?.data?.data?.data || av?.data?.data || av?.data || av;
          if (u) saveUserToLocal(u);
        } catch (e) {
          // ignore: might mean account needs verification
        }
      }

      toast.success("Logged in");
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";

      if (err?.response?.status === 403 && String(msg).toLowerCase().includes("verify")) {
        toast.error("Email not verified. Please verify first.");
        navigate(`/verifyOTP?email=${encodeURIComponent(email)}`);
      } else if (err?.response?.status === 404) {
        toast.info("Email not registered. Redirecting to registration...");
        navigate("/register");
      } else {
        toast.error(typeof msg === "string" ? msg : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast.info("Enter your email above to resend verification");
      return;
    }
    if (resending) return;
    setResending(true);
    try {
      const res = await axiosInstance.post("/resend-otp", { email });
      const msg = res?.data?.data?.message || res?.data?.message || "Verification email resent";
      toast.success(msg);
      navigate(`/verifyOTP?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Resend OTP error:", err);
      const msg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend verification";
      toast.error(typeof msg === "string" ? msg : "Failed to resend verification");
    } finally {
      setResending(false);
    }
  };

  return (
    <Container className="py-5">
      <LoadingOverlay show={loading} message="Logging in..." />
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <h3 className="text-white fw-bold">Login</h3>
            <Form onSubmit={submit} className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required name="email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div style={{ position: "relative" }}>
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required name="password" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: "absolute", right: 8, top: 8, background: "transparent", border: "none", padding: 6, cursor: "pointer", color: "#666" }} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Form.Group>

              <div>
                <EdButton type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</EdButton>
              </div>

              <div className="mt-3 text-muted">
                New here? <a href="/register">Create an account</a>
              </div>

              <div className="mt-2 text-muted">
                <a href="/forgot-password" className="text-primary text-decoration-underline fw-semibold">Forgot password?</a>
              </div>

              <div className="mt-2 text-muted">
                Didn't receive verification?{" "}
                <a role="button" onClick={resendVerification} className="text-primary text-decoration-underline fw-semibold" style={{ cursor: resending ? "not-allowed" : "pointer", opacity: resending ? 0.6 : 1 }}>
                  {resending ? "Resending..." : "Resend verification"}
                </a>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

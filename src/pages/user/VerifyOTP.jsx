// src/pages/user/VerifyOTP.jsx
import { Container, Row, Col, Form } from "react-bootstrap";
import EdButton from "../../components/ui/button";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { saveUserToLocal, setToken } from "../../utils/authHelpers";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Prefill email from preRegisterCreds if available
  useEffect(() => {
    try {
      const pre = localStorage.getItem("preRegisterCreds");
      if (pre) {
        const creds = JSON.parse(pre);
        if (creds?.email) setEmail(creds.email);
      }
    } catch {}
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (verifying) return;
    if (!email || !otp) {
      toast.info("Enter email and OTP");
      return;
    }

    setVerifying(true);
    try {
      // 1) Ask backend to verify OTP — wait for it to persist
      const verifyRes = await axiosInstance.post("/verify-otp", { email, otp });
      // optionally check response body
      // console.log("verifyRes", verifyRes?.data);

      toast.success("Email verified successfully");

      // 2) Attempt auto-login only if we stored preRegisterCreds (safe path)
      try {
        const pre = localStorage.getItem("preRegisterCreds");
        if (pre) {
          const creds = JSON.parse(pre);
          if (creds?.email === email && creds?.password) {
            // login and get token
            const res = await axiosInstance.post("/loginsignup", {
              email: creds.email,
              password: creds.password,
            });

            // extract token and user robustly
            const d = res?.data || {};
            const token =
              d.token ||
              d.data?.token ||
              d.data?.authToken ||
              d.data?.data?.token ||
              d.authToken ||
              res?.headers?.authorization ||
              null;

            let userObj =
              d.user ||
              d.data?.user ||
              d.data?.data?.user ||
              d.data?.data ||
              d.data ||
              null;

            // if token found, set it for axios + localStorage
            if (token) {
              setToken(token);
              localStorage.setItem("token", token); // setToken already does this but safe
            }

            // if login returned user, save; otherwise attempt authverify
            if (userObj && typeof userObj === "object") {
              if (userObj.user) userObj = userObj.user;
              saveUserToLocal(userObj);
            } else if (token) {
              // fetch authoritative profile now that token is set
              try {
                const av = await axiosInstance.post("/authverify", {});
                const u = av?.data?.data?.data || av?.data?.data || av?.data || av;
                if (u) saveUserToLocal(u);
              } catch (e) {
                // authverify failed — server might not have persisted or token invalid
                console.warn("authverify after login failed", e);
              }
            }

            // clear preRegisterCreds
            localStorage.removeItem("preRegisterCreds");
            window.dispatchEvent(new Event("authChanged"));
            toast.success("Logged in automatically");

            // final check: ensure the saved user has isVerify true (optional)
            try {
              const currentUser = JSON.parse(localStorage.getItem("user") || "null");
              if (!currentUser?.isVerify) {
                // re-fetch profile as a sanity check
                const av2 = await axiosInstance.post("/authverify", {});
                const u2 = av2?.data?.data?.data || av2?.data?.data || av2?.data || av2;
                if (u2) saveUserToLocal(u2);
              }
            } catch (ignore) {}

            navigate("/");
            return;
          }
        }
      } catch (autoLoginErr) {
        // ignore auto-login failure; we'll redirect to login below
        console.warn("Auto-login failed", autoLoginErr);
      }

      // 3) No auto-login -> redirect to login (user should login manually)
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

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 style={{ color: "#fff" }}>Verify Email (OTP)</h3>
          <Form onSubmit={submit} className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <EdButton type="submit" disabled={verifying}>
              {verifying ? "Verifying..." : "Verify"}
            </EdButton>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOTP;

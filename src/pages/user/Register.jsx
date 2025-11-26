import { Container, Row, Col, Form } from "react-bootstrap";
import EdButton from "../../components/ui/button";
import { useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { DEFAULT_AVATAR_URL } from "../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const passwordRules = [
  { id: "len", label: "At least 8 characters", test: (s) => s.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (s) => /[A-Z]/.test(s) },
  { id: "lower", label: "One lowercase letter", test: (s) => /[a-z]/.test(s) },
  { id: "digit", label: "One number", test: (s) => /[0-9]/.test(s) },
  { id: "special", label: "One special character", test: (s) => /[^A-Za-z0-9]/.test(s) },
];

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validation = useMemo(
    () => passwordRules.map((r) => ({ ...r, ok: r.test(password) })),
    [password]
  );

  const allValid = validation.every((r) => r.ok);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!allValid) {
      toast.info("Password does not meet minimum security requirements");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(`/signup`, {
        firstname,
        lastname,
        email,
        password,
        profilePic: DEFAULT_AVATAR_URL,
      });

      toast.success("Verification OTP sent — check your email");
      navigate("/verify");
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.data?.message ||
        err?.response?.data?.message ||
        err?.message;

      if (status === 409) {
        toast.info(msg || "Email already registered");
        navigate("/login");
      } else {
        toast.error(msg || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <LoadingOverlay show={loading} message="Registering..." />
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <h3 className="text-white">Register</h3>

            <Form onSubmit={submit} className="mt-3">

              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Input value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Input value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              {/* PASSWORD FIELD WITH EYE ICON */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>

                <div style={{ position: "relative" }}>
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {/* Eye toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 8,
                      background: "transparent",
                      border: "none",
                      color: "#bbb",
                      cursor: "pointer"
                    }}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Helper text only */}
                <Form.Text className="text-muted mt-2 d-block">
                  Password must include uppercase, lowercase, number & special character.
                </Form.Text>
              </Form.Group>

              <EdButton type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </EdButton>

            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

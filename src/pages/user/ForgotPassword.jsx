// src/pages/user/ForgotPassword.jsx
import { Container, Row, Col, Form } from "react-bootstrap";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import EdButton from "../../components/ui/button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (sending) return;

        setSending(true);
        try {
            await axiosInstance.post(`/forgot-password`, { email });
            toast.success("Reset OTP sent to your email");
            navigate("/enter-reset-otp", { state: { email } });
        } catch (err) {
            console.error(err);
            toast.error("Failed to send reset OTP");
        } finally {
            setSending(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <h3 style={{ color: "#fff" }}>Forgot Password</h3>

                        <Form onSubmit={submit} className="mt-3">
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your email</Form.Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <EdButton type="submit" disabled={sending}>
                                {sending ? "Sending..." : "Send OTP"}
                            </EdButton>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;

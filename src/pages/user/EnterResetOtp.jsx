import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import EdButton from "../../components/ui/button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

const EnterResetOtp = () => {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [verifying, setVerifying] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location?.state?.email) setEmail(location.state.email);
    }, [location]);

    const submit = async (e) => {
        e.preventDefault();
        if (verifying) return;
        if (!email) {
            toast.info("Please enter your email");
            return;
        }
        if (!otp) {
            toast.info("Please enter the OTP");
            return;
        }

        setVerifying(true);
        try {
            try {
                await axiosInstance.post("/verify-reset-otp", { email, otp });
                // if successful proceed to reset password page
                navigate("/reset-password", { state: { email, otp } });
            } catch (err) {
                if (err?.response?.status === 404 || err?.response?.status === 405) {
                    navigate("/reset-password", { state: { email, otp } });
                } else {
                    const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err?.message;
                    toast.error(msg || "OTP verification failed");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to verify OTP");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <h3 style={{ color: "#fff" }}>Enter Reset OTP</h3>
                        <form onSubmit={submit} className="mt-3">
                            <div className="mb-3">
                                <label style={{ color: "var(--text-muted)" }}>Email</label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="mb-3">
                                <label style={{ color: "var(--text-muted)" }}>OTP</label>
                                <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            </div>

                            <div className="d-flex gap-2">
                                <EdButton type="submit" disabled={verifying}>
                                    {verifying ? "Proceeding..." : "Proceed to reset password"}
                                </EdButton>
                                <EdButton variant="outline" onClick={() => navigate("/forgot-password")}>Back</EdButton>
                            </div>
                        </form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EnterResetOtp;

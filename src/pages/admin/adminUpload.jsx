import { useState } from "react";
import axios from "axios";
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadProductPage = () => {
    const [productname, setProductname] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const categories = [
        "Mobiles",
        "Laptops",
        "Airbuds",
        "Earphones",
        "Smartwatches",
        "Accessories",
        "Tablets",
        "Gaming Consoles",
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const formdata = new FormData();
            formdata.append("productname", productname);
            formdata.append("price", price);
            formdata.append("description", description);
            formdata.append("category", category);
            formdata.append("file", file);

            const res = await axios.post(
                "http://localhost:8888/.netlify/functions/index/Users",
                formdata
            );

            toast.success("✅ Product uploaded successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            console.log("Response:", res.data);

            // Reset form
            setProductname("");
            setPrice("");
            setDescription("");
            setCategory("");
            setFile(null);
            setPreview("");
        } catch (err) {
            console.error("Upload error:", err);

            // Backend message (if available)
            const errorMsg =
                err.response?.data?.message ||
                "❌ Upload failed. Please try again.";

            // Use toast instead of Alert
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 4000,
            });

            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4 position-relative">
            {/* 🟢 Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
            />

            {/* 🟩 Loading Overlay */}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3000,
                        backdropFilter: "blur(3px)",
                    }}
                >
                    <Spinner animation="border" variant="light" />
                </div>
            )}

            <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                    <h3 className="text-center mb-4">Upload New Product</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="productname">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product name"
                                        value={productname}
                                        onChange={(e) => setProductname(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="price">
                                    <Form.Label>Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter product description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="category">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat.toLowerCase()}>
                                                {cat}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="file">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {preview && (
                                <Col xs={12} className="text-center mt-3">
                                    <div className="d-inline-block border rounded-4 p-2 bg-light">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                objectFit: "cover",
                                                borderRadius: "12px",
                                            }}
                                        />
                                    </div>
                                    <p className="text-muted small mt-2">Image Preview</p>
                                </Col>
                            )}

                            <Col xs={12} className="text-center mt-3">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="px-4 rounded-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />{" "}
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload Product"
                                    )}
                                </Button>
                            </Col>

                            {message && (
                                <Col xs={12} className="text-center mt-3">
                                    <Alert
                                        variant={message.includes("✅") ? "success" : "danger"}
                                        className="py-2"
                                    >
                                        {message}
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UploadProductPage;

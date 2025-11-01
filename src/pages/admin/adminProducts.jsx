import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_API } from '../../config';
import {
    Card,
    Button,
    Badge,
    Form,
    Row,
    Col,
    Spinner,
    Modal,
    Toast,
    ToastContainer,
} from "react-bootstrap";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", variant: "" });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    const categories = [
        "All",
        "Mobiles",
        "Laptops",
        "Airbuds",
        "Earphones",
        "Smartwatches",
        "Accessories",
        "Tablets",
        "Gaming Consoles",
    ];

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => setToast({ show: false, message: "", variant: "" }), 2500);
    };

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await axios.get(`${BACKEND_API}/products`);
                const fetched = res.data.products || [];
                setProducts(fetched);
                setFilteredProducts(fetched);
            } catch (err) {
                console.error("❌ Fetch failed:", err);
                showToast("Failed to load products", "danger");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") setFilteredProducts(products);
        else {
            const filtered = products.filter(
                (p) =>
                    p.category &&
                    p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
            setFilteredProducts(filtered);
        }
    }, [selectedCategory, products]);

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            setActionLoading(true);
            await axios.delete(`${BACKEND_API}/products/${deleteConfirm.id}`);
            setProducts(products.filter((p) => p._id !== deleteConfirm.id));
            setFilteredProducts(filteredProducts.filter((p) => p._id !== deleteConfirm.id));
            showToast("🗑 Product deleted successfully", "success");
        } catch (err) {
            console.error("❌ Delete failed:", err);
            showToast("Failed to delete product", "danger");
        } finally {
            setDeleteConfirm({ show: false, id: null });
            setActionLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setPreviewImage(product.image || "");
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setEditProduct({ ...editProduct, imageFile: files[0] });
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setEditProduct({ ...editProduct, [name]: value });
        }
    };

    const handleSave = async () => {
        if (!editProduct) return;

        const formData = new FormData();
        formData.append("productname", editProduct.productname);
        formData.append("price", editProduct.price);
        formData.append("description", editProduct.description);
        formData.append("category", editProduct.category);
        formData.append("brand", editProduct.brand || "");

        if (editProduct.imageFile) formData.append("file", editProduct.imageFile);

        setActionLoading(true);
        try {
            const res = await axios.put(`${BACKEND_API}/products/${editProduct._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

            const updated =
                res.data.updatedProduct ||
                res.data.product ||
                res.data ||
                {};

            if (updated && updated._id) {
                showToast("✅ Product updated successfully!", "success");

                setProducts((prev) =>
                    prev.map((p) =>
                        p._id === editProduct._id ? { ...p, ...updated } : p
                    )
                );

                setFilteredProducts((prev) =>
                    prev.map((p) =>
                        p._id === editProduct._id ? { ...p, ...updated } : p
                    )
                );

                setShowModal(false);
            } else {
                console.warn("⚠️ Unexpected response:", res.data);
                showToast("❌ Update failed. Unexpected response format.", "danger");
            }
        } catch (err) {
            console.error("❌ Update failed:", err);
            showToast("❌ Something went wrong while updating.", "danger");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );

    return (
        <div className="container my-4">
            {actionLoading && (
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

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h3 className="fw-bold text-primary">📦 Manage Products</h3>
                <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ maxWidth: "220px" }}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </Form.Select>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="text-muted text-center">No products found.</p>
            ) : (
                <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                    {filteredProducts.map((p) => {
                        const imageUrl =
                            p.image || "https://via.placeholder.com/300x220?text=No+Image";
                        const name = p.productname || "Unnamed Product";
                        const desc = p.description || "No description available.";
                        const price = p.price ? `₹${p.price}` : "N/A";
                        const category = p.category || "Uncategorized";

                        return (
                            <Col key={p._id}>
                                <Card
                                    className="h-100 shadow-lg border-0 rounded-4 overflow-hidden"
                                    style={{
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        minHeight: "480px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-8px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 15px 30px rgba(0,0,0,0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 5px 15px rgba(0,0,0,0.1)";
                                    }}
                                >
                                    {/* 🖼 Updated image section */}
                                    <div className="position-relative">
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "270px",
                                                backgroundColor: "#f8f9fa",
                                                borderBottom: "1px solid #eee",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={name}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>
                                        <Badge
                                            bg="primary"
                                            className="position-absolute top-0 end-0 m-2 rounded-pill px-3 py-1"
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            {category}
                                        </Badge>
                                    </div>

                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div>
                                            <Card.Title className="fw-semibold text-truncate mb-2">
                                                {name}
                                            </Card.Title>
                                            <Card.Text
                                                className="text-muted"
                                                style={{
                                                    fontSize: "0.9rem",
                                                    minHeight: "60px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {desc}
                                            </Card.Text>
                                        </div>

                                        <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                                            <h6 className="fw-bold text-success mb-0">{price}</h6>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleEdit(p)}
                                                >
                                                    ✏️ Edit
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteConfirm({ show: true, id: p._id })
                                                    }
                                                >
                                                    🗑 Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* 🟩 Edit Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                dialogClassName="modal-dialog-scrollable"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {editProduct && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="productname"
                                    value={editProduct.productname || ""}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={editProduct.description || ""}
                                    onChange={handleChange}
                                    placeholder="Enter product details"
                                />
                            </Form.Group>

                            <Row className="g-2">
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={editProduct.price || ""}
                                            onChange={handleChange}
                                            placeholder="Enter price"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={editProduct.price || ""}
                                            onChange={handleChange}
                                            placeholder="Enter price"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            name="category"
                                            value={editProduct.category || ""}
                                            onChange={handleChange}
                                        >
                                            {categories
                                                .filter((cat) => cat !== "All")
                                                .map((cat) => (
                                                    <option key={cat} value={cat.toLowerCase()}>
                                                        {cat}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Brand</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="brand"
                                            value={editProduct.brand || ""}
                                            onChange={handleChange}
                                            placeholder="Enter brand"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Change Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                {previewImage && (
                                    <div className="mt-3 text-center">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="rounded shadow-sm"
                                            style={{
                                                width: "100%",
                                                maxHeight: "200px",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>

                <Modal.Footer className="d-flex flex-wrap justify-content-between">
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                        className="w-100 w-md-auto mb-2 mb-md-0"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="w-100 w-md-auto"
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 🟥 Delete Confirmation */}
            <Modal
                show={deleteConfirm.show}
                onHide={() => setDeleteConfirm({ show: false, id: null })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="mb-3">
                        ⚠️ Are you sure you want to <strong>delete this product?</strong>
                        <br />
                        This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setDeleteConfirm({ show: false, id: null })}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                className="position-fixed top-0 end-0 p-3"
                style={{ zIndex: 2000 }}
            >
                <Toast
                    show={toast.show}
                    bg={toast.variant}
                    onClose={() => setToast({ show: false })}
                    delay={2500}
                    autohide
                    style={{
                        transform: "translateY(20px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        borderRadius: "10px",
                    }}
                >
                    <Toast.Body className="text-white fw-semibold">
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default ProductsPage;

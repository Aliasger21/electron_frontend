import { Container, Row, Col, Card, Badge, Spinner, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(() => searchParams.get('search') || "");
    const [category, setCategory] = useState(() => searchParams.get('category') || "");
    const [brand, setBrand] = useState(() => searchParams.get('brand') || "");

    const categories = [
        "mobiles",
        "laptops",
        "airbuds",
        "earphones",
        "smartwatches",
        "accessories",
        "tablets",
        "gaming consoles",
    ];

    const cardStyle = {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        transition: "all 0.25s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    };

    const [page, setPage] = useState(() => parseInt(searchParams.get('page')) || 1);
    const [perPage, setPerPage] = useState(() => parseInt(searchParams.get('perPage')) || 12);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const params = { page, perPage };
                if (category) params.category = category;
                if (brand) params.brand = brand;
                if (search) params.search = search;
                const res = await axios.get(`${BACKEND_API}/products`, { params });
                const fetched = res.data.products || [];
                setProducts(fetched);
                setTotal(res.data.total || 0);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [page, perPage, category, brand, search]);

    // sync URL query params -> state when route changes (e.g., clicking a category link)
    useEffect(() => {
        const qCategory = searchParams.get('category') || '';
        const qSearch = searchParams.get('search') || '';
        const qBrand = searchParams.get('brand') || '';
        const qPage = parseInt(searchParams.get('page')) || 1;
        const qPerPage = parseInt(searchParams.get('perPage')) || perPage;
        if (qCategory !== category) setCategory(qCategory);
        if (qSearch !== search) setSearch(qSearch);
        if (qBrand !== brand) setBrand(qBrand);
        if (qPage !== page) setPage(qPage);
        if (qPerPage !== perPage) setPerPage(qPerPage);
    }, [searchParams]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    let content;
    if (loading) {
        content = (
            <Row>
                <Col className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </Col>
            </Row>
        );
    } else if (products.length === 0) {
        content = (
            <Row>
                <Col className="text-center py-5">
                    <p style={{ color: "var(--text-muted)" }}>No products found.</p>
                </Col>
            </Row>
        );
    } else {
        content = (
            <>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {products.map((p) => (
                        <Col key={p._id}>
                            <Link to={`/products/${p._id}`} style={{ textDecoration: "none" }}>
                                <Card style={cardStyle} className="h-100">
                                    <div className="product-image">
                                        <img className="responsive-img" src={p.image || "https://via.placeholder.com/200"} alt={p.productname} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 600 }}>{p.productname}</Card.Title>
                                        <Card.Text style={{ color: "var(--text-muted)", flex: 1 }}>{p.description}</Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <h5 style={{ color: "var(--accent)", fontWeight: 700 }}>Rs {p.price}</h5>
                                            <Badge style={{ backgroundColor: "var(--accent)" }}>{p.category}</Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>

                {/* Pagination controls */}
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                    <Button variant="outline-light" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const pg = idx + 1;
                        if (totalPages > 9) {
                            if (pg === 1 || pg === 2 || pg === totalPages - 1 || pg === totalPages || (pg >= page - 1 && pg <= page + 1)) {
                                return (
                                    <Button key={pg} size="sm" variant={pg === page ? 'primary' : 'outline-light'} onClick={() => setPage(pg)}>{pg}</Button>
                                );
                            }
                            if (pg === 3 && page > 4) return <span key={pg} style={{ color: 'var(--text-muted)', padding: '0 6px' }}>...</span>;
                            if (pg === totalPages - 2 && page < totalPages - 3) return <span key={pg} style={{ color: 'var(--text-muted)', padding: '0 6px' }}>...</span>;
                            return null;
                        }
                        return (
                            <Button key={pg} size="sm" variant={pg === page ? 'primary' : 'outline-light'} onClick={() => setPage(pg)}>{pg}</Button>
                        );
                    })}
                    <Button variant="outline-light" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
            </>
        );
    }

    return (
        <Container className="py-5">
            <Row className="align-items-center mb-4">
                <Col md={6} className="mb-2">
                    <h2 style={{ color: "#ffffff" }}>Products</h2>
                </Col>
                <Col md={6}>
                    <div className="filters d-flex gap-2 justify-content-md-end align-items-center flex-wrap">
                        <Form.Select
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                            className="filter-control"
                        >
                            <option value="">All categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c[0].toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Select
                            value={brand}
                            onChange={(e) => { setBrand(e.target.value); setPage(1); }}
                            className="filter-control"
                        >
                            <option value="">All brands</option>
                            {Array.from(new Set(products.map(p => (p.brand || '').toLowerCase()).filter(Boolean))).map(b => (
                                <option key={b} value={b}>{b[0].toUpperCase() + b.slice(1)}</option>
                            ))}
                        </Form.Select>

                        <Form.Control
                            type="search"
                            placeholder="Search products"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="filter-control"
                        />

                        <Form.Select
                            value={perPage}
                            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                            className="filter-control"
                        >
                            <option value={8}>8 / page</option>
                            <option value={12}>12 / page</option>
                            <option value={24}>24 / page</option>
                        </Form.Select>

                        <Button variant="outline-light" onClick={() => { setSearch(""); setCategory(""); setBrand(""); }}>
                            Reset
                        </Button>
                    </div>
                </Col>
            </Row>

            {content}
        </Container>
    );
};

export default Products;

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Form, Button } from "react-bootstrap";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_API } from '../../config';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-sourced initial state
  const [page, setPage] = useState(() => parseInt(searchParams.get('page')) || 1);
  const [perPage, setPerPage] = useState(() => parseInt(searchParams.get('perPage')) || 12);
  const [category, setCategory] = useState(() => searchParams.get('category') || "");
  const [brand, setBrand] = useState(() => searchParams.get('brand') || "");
  const [search, setSearch] = useState(() => searchParams.get('search') || "");

  // For debounce UX: controlled input state
  const [searchTerm, setSearchTerm] = useState(search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // categories as slug + label to avoid mismatches with spaces
  const categories = [
    { slug: "mobiles", label: "Mobiles" },
    { slug: "laptops", label: "Laptops" },
    { slug: "airbuds", label: "Airbuds" },
    { slug: "earphones", label: "Earphones" },
    { slug: "smartwatches", label: "Smartwatches" },
    { slug: "accessories", label: "Accessories" },
    { slug: "tablets", label: "Tablets" },
    { slug: "gaming-consoles", label: "Gaming Consoles" },
  ];

  // small style object for card (kept from original code)
  const cardStyle = {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    transition: "all 0.25s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  };

  // formatter for prices
  const priceFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    } catch {
      return { format: (v) => `Rs ${v}` };
    }
  }, []);

  // debounce searchTerm -> search (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // keep URL in sync with state
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (page) params.page = page;
    if (perPage) params.perPage = perPage;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, brand, page, perPage]);

  // when URL changes, sync into component state
  useEffect(() => {
    const qCategory = searchParams.get('category') || '';
    const qSearch = searchParams.get('search') || '';
    const qBrand = searchParams.get('brand') || '';
    const qPage = parseInt(searchParams.get('page')) || 1;
    const qPerPage = parseInt(searchParams.get('perPage')) || perPage;

    if (qCategory !== category) setCategory(qCategory);
    if (qSearch !== search) {
      setSearch(qSearch);
      setSearchTerm(qSearch);
    }
    if (qBrand !== brand) setBrand(qBrand);
    if (qPage !== page) setPage(qPage);
    if (qPerPage !== perPage) setPerPage(qPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // helper to produce a compact list of pages to render
  const getVisiblePages = (totalPages, current) => {
    const pages = [];
    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1, 2);
    const left = Math.max(3, current - 1);
    const right = Math.min(totalPages - 2, current + 1);

    if (left > 3) pages.push('left-ellipsis');
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 2) pages.push('right-ellipsis');

    pages.push(totalPages - 1, totalPages);
    return pages.filter((v, i, arr) => arr.indexOf(v) === i);
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const fetchControllerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    if (fetchControllerRef.current) {
      try { fetchControllerRef.current.abort(); } catch { }
    }
    fetchControllerRef.current = controller;

    async function fetchProducts() {
      setLoading(true);
      try {
        // Convert slug -> label for backend compatibility
        const categoryLabel = categories.find(c => c.slug === category)?.label || category;

        const params = { page, perPage };
        if (category) params.category = categoryLabel;
        if (brand) params.brand = brand;
        if (search) params.search = search;

        // Helpful debug logs (remove in production)
        // eslint-disable-next-line no-console
        console.debug("Products: fetching with params:", params);

        const res = await axios.get(`${BACKEND_API}/products`, { params, signal: controller.signal });
        // eslint-disable-next-line no-console
        console.debug("Products: backend response:", res?.data);

        let fetched = res.data.products || [];
        let returnedTotal = typeof res.data.total === 'number' ? res.data.total : fetched.length;

        // If backend returned no products for a category, attempt a safe client-side fallback:
        // 1) If backend provided an `allProducts` key (some APIs do), use that pool.
        // 2) Otherwise — as a last resort — fetch without the category filter (with a capped perPage) and filter client-side.
        if (fetched.length === 0 && category) {
          const normalizedWanted = (category.replace(/-/g, ' ').trim().toLowerCase());

          // try allProducts if backend included it
          const pool = Array.isArray(res.data.allProducts) ? res.data.allProducts : null;

          if (pool) {
            fetched = pool.filter(p => {
              const pcat = (p.category || '').toString().trim().toLowerCase();
              const pcatNormalized = pcat.replace(/\s+/g, ' ');
              return pcatNormalized === normalizedWanted || pcat === category || pcat === category.replace(/-/g, ' ');
            });
            returnedTotal = fetched.length;
            // eslint-disable-next-line no-console
            console.debug("Products: fallback filtered from allProducts ->", fetched.length);
          } else {
            // last resort: fetch a larger unfiltered list and filter client-side (caution: may be heavy)
            try {
              const fallbackRes = await axios.get(`${BACKEND_API}/products`, { params: { page: 1, perPage: 1000, search }, signal: controller.signal });
              const pool2 = fallbackRes.data.products || [];
              fetched = pool2.filter(p => {
                const pcat = (p.category || '').toString().trim().toLowerCase();
                const pcatNormalized = pcat.replace(/\s+/g, ' ');
                return pcatNormalized === normalizedWanted || pcat === category || pcat === category.replace(/-/g, ' ');
              });
              returnedTotal = fetched.length;
              // eslint-disable-next-line no-console
              console.debug("Products: fallback fetched and filtered ->", fetched.length);
            } catch (fallbackErr) {
              // ignore fallback errors but log
              // eslint-disable-next-line no-console
              console.error("Products: fallback fetch failed", fallbackErr);
            }
          }
        }

        if (!mounted) return;

        setProducts(fetched);
        setTotal(returnedTotal || fetched.length);
      } catch (err) {
        const isAbort = err?.name === 'CanceledError' || err?.message?.toLowerCase()?.includes('canceled') || err?.code === 'ERR_CANCELED';
        if (!isAbort) {
          // eslint-disable-next-line no-console
          console.error("Failed to fetch products", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
      try { controller.abort(); } catch { }
    };
  }, [page, perPage, category, brand, search]);

  // derive brand options from fetched products (memoized)
  const brandOptions = useMemo(() => {
    const setB = new Set();
    products.forEach(p => {
      const b = (p.brand || '').toString().trim().toLowerCase();
      if (b) setB.add(b);
    });
    return Array.from(setB).sort();
  }, [products]);

  // UTIL: truncate a string to N chars, preserve words, return { short, isTruncated }
  const truncateChars = (text = "", max = 120) => {
    if (!text) return { short: "", isTruncated: false };
    if (text.length <= max) return { short: text, isTruncated: false };
    const truncated = text.slice(0, max);
    const lastSpace = truncated.lastIndexOf(" ");
    const short = lastSpace > 20 ? truncated.slice(0, lastSpace) + "…" : truncated + "…";
    return { short, isTruncated: true };
  };

  // Render content
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
          {products.map((p) => {
            const { short, isTruncated } = truncateChars(p.description, 120);
            return (
              <Col key={p._id}>
                <div onClick={() => navigate(`/products/${p._id}`)} style={{ textDecoration: "none" }}>
                  <Card style={cardStyle} className="h-100 product-card">
                    <div className="product-image" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
                      <img
                        className="responsive-img"
                        src={p.image || "https://via.placeholder.com/200"}
                        alt={p.productname || p.category || "Product image"}
                        loading="lazy"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 600 }}>{p.productname}</Card.Title>

                      <Card.Text style={{ color: "var(--text-muted)", flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span>{short}</span>
                        {isTruncated && (
                          <>
                            {" "}
                            <Button
                              as={Link}
                              to={`/products/${p._id}`}
                              variant="link"
                              size="sm"
                              aria-label={`Read more about ${p.productname}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ padding: 0, fontWeight: 600, color: "var(--accent)" }}
                            >
                              Read more+
                            </Button>
                          </>
                        )}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <h5 style={{ color: "var(--accent)", fontWeight: 700 }}>{priceFormatter.format(Number(p.price || 0))}</h5>
                        <Badge style={{ backgroundColor: "var(--accent)" }}>{p.category}</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            );
          })}
        </Row>

        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          <Button variant="outline-light" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>

          {getVisiblePages(totalPages, page).map((pg, idx) => {
            if (pg === 'left-ellipsis' || pg === 'right-ellipsis') {
              return <span key={`ell-${idx}`} style={{ color: 'var(--text-muted)', padding: '0 6px' }}>...</span>;
            }
            return (
              <Button
                key={pg}
                size="sm"
                variant={pg === page ? 'primary' : 'outline-light'}
                onClick={() => setPage(pg)}
              >
                {pg}
              </Button>
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
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              value={brand}
              onChange={(e) => { setBrand(e.target.value); setPage(1); }}
              className="filter-control"
            >
              <option value="">All brands</option>
              {brandOptions.map(b => (
                <option key={b} value={b}>{b[0].toUpperCase() + b.slice(1)}</option>
              ))}
            </Form.Select>

            <Form.Control
              type="search"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); }}
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

            <Button variant="outline-light" onClick={() => { setSearchTerm(""); setSearch(""); setCategory(""); setBrand(""); setPage(1); }}>
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

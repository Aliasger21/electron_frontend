// src/components/header/Header.jsx
import { Navbar, Nav, Container, Badge, NavDropdown, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useEffect, useState, useRef } from "react";
import { DEFAULT_AVATAR_URL } from '../../config';
import EdButton from "../ui/button";

const Header = () => {
  const { cart } = useCart();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null } catch { return null }
  });
  const navigate = useNavigate();
  const location = useLocation();

  // navbar collapse state for mobile
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);

  // cart & profile dropdown open state (controlled)
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // refs for mouseleave detection (safe)
  const cartRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onAuth = () => {
      try { setUser(JSON.parse(localStorage.getItem('user')) || null) } catch { setUser(null) }
    }
    window.addEventListener('authChanged', onAuth);
    return () => window.removeEventListener('authChanged', onAuth);
  }, []);

  // Close navbar whenever route changes (auto-close mobile menu)
  useEffect(() => {
    setExpanded(false);
    setCartOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
    closeMenu();
  };

  const subtotal = (cart || []).reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);

  // Helpers to safely open/close dropdowns (ignore on small touch screens)
  const isTouchDevice = () => {
    try { return ('ontouchstart' in window) || navigator.maxTouchPoints > 0; } catch { return false; }
  };

  const onCartMouseEnter = () => {
    if (!isTouchDevice()) setCartOpen(true);
  };
  const onCartMouseLeave = (e) => {
    // make sure leaving the whole dropdown area closes it
    if (!isTouchDevice()) {
      if (!cartRef.current) { setCartOpen(false); return; }
      // If mouse moved outside the cartRef area, close
      if (!cartRef.current.contains(e.relatedTarget)) setCartOpen(false);
    }
  };

  const onProfileMouseEnter = () => {
    if (!isTouchDevice()) setProfileOpen(true);
  };
  const onProfileMouseLeave = (e) => {
    if (!isTouchDevice()) {
      if (!profileRef.current) { setProfileOpen(false); return; }
      if (!profileRef.current.contains(e.relatedTarget)) setProfileOpen(false);
    }
  };

  // keyboard support: close on Escape
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape') {
        setCartOpen(false);
        setProfileOpen(false);
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      expanded={expanded}
      onToggle={(val) => setExpanded(val)}
      className="py-3"
      style={{
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4"
          style={{ color: "var(--accent)" }}
          onClick={closeMenu}
        >
          Electron<span style={{ color: "var(--text)" }}>.store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="gap-3 align-items-center">

            <Nav.Link as={Link} to="/" onClick={closeMenu}>Home</Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={closeMenu}>Products</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeMenu}>About</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={closeMenu}>Contact</Nav.Link>

            {/* ----- Cart dropdown (hover to open on desktop, click to toggle on touch) ----- */}
            <div
              ref={cartRef}
              onMouseEnter={onCartMouseEnter}
              onMouseLeave={onCartMouseLeave}
              style={{ position: 'relative' }}
            >
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center" aria-hidden>
                    Cart
                    <Badge bg="danger" pill style={{ marginLeft: 6, minWidth: 28, textAlign: 'center' }}>
                      {cart?.length || 0}
                    </Badge>
                  </span>
                }
                id="cart-dropdown"
                align="end"
                show={cartOpen}
                onToggle={(next) => setCartOpen(next)}
                menuVariant="dark"
                renderMenuOnMount
              >
                <div className="cart-dropdown-panel p-2" style={{ minWidth: 300, maxWidth: 420 }}>
                  {(!cart || cart.length === 0) ? (
                    <div className="text-center py-4">
                      <div style={{ fontSize: 22, marginBottom: 6 }}>🛒</div>
                      <div style={{ color: "var(--text)", fontWeight: 600 }}>Your cart is empty</div>
                      <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>Looks like you haven't added anything yet.</div>
                      <div className="mt-3">
                        <Button as={Link} to="/products" variant="outline-light" size="sm" onClick={() => { closeMenu(); setCartOpen(false); }}>Browse Products</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: 300, overflowY: "auto", paddingRight: 6 }}>
                        {(cart || []).slice(0, 8).map((it) => (
                          <div key={it._id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 6px", borderRadius: 8 }}>
                            <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <img src={it.image || DEFAULT_AVATAR_URL} alt={it.productname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {it.productname}
                              </div>
                              <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
                                Qty: {it.qty} • {it.brand || "—"}
                              </div>
                            </div>

                            <div style={{ color: "var(--accent)", fontWeight: 700, marginLeft: 8 }}>
                              ₹{(Number(it.price || 0) * Number(it.qty || 1)).toFixed(0)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 10, paddingTop: 10 }}>
                        <Row className="align-items-center gx-2">
                          <Col>
                            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Subtotal</div>
                            <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 16 }}>₹{subtotal.toFixed(0)}</div>
                          </Col>
                          <Col xs="auto" className="d-flex gap-2">
                            <Button as={Link} to="/cart" variant="light" style={{ minWidth: 92 }} onClick={() => { closeMenu(); setCartOpen(false); }}>View Cart</Button>
                            <EdButton as={Link} to="/checkout" variant="primary" style={{ minWidth: 92 }} onClick={() => { closeMenu(); setCartOpen(false); }}>
                              Checkout
                            </EdButton>
                          </Col>
                        </Row>
                        <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                          Shipping calculated at checkout
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </NavDropdown>
            </div>

            {/* ----- Profile dropdown (richer panel) ----- */}
            <div
              ref={profileRef}
              onMouseEnter={onProfileMouseEnter}
              onMouseLeave={onProfileMouseLeave}
              style={{ position: 'relative' }}
            >
              {user ? (
                <NavDropdown
                  id="user-dropdown"
                  align="end"
                  show={profileOpen}
                  onToggle={(next) => setProfileOpen(next)}
                  title={
                    <span className="d-flex align-items-center gap-2" aria-hidden>
                      <img src={user.profilePic || DEFAULT_AVATAR_URL} alt="user" className="avatar-xxs" />
                      <span style={{ color: '#fff', fontWeight: 600 }}>{user.firstname || user.email}</span>
                    </span>
                  }
                  menuVariant="dark"
                  renderMenuOnMount
                >
                  <div style={{ minWidth: 240, maxWidth: 320, padding: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                        <img src={user.profilePic || DEFAULT_AVATAR_URL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: 'var(--text)', fontWeight: 700 }}>{user.firstname || user.name || user.email}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user.email || ''}</div>
                      </div>
                    </div>

                    <hr style={{ borderColor: 'rgba(255,255,255,0.04)', margin: '12px 0' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Button as={Link} to="/profile" variant="light" size="sm" onClick={() => { closeMenu(); setProfileOpen(false); }}>View Profile</Button>
                      <Button as={Link} to="/orders" variant="outline-light" size="sm" onClick={() => { closeMenu(); setProfileOpen(false); }}>My Orders</Button>
                      <Button variant="danger" size="sm" onClick={() => { handleLogout(); setProfileOpen(false); }}>Logout</Button>
                    </div>
                  </div>
                </NavDropdown>
              ) : (
                <Nav className="ms-2 gap-2 align-items-center">
                  <Nav.Link as={Link} to="/login" onClick={() => { closeMenu(); setProfileOpen(false); }}>Login</Nav.Link>
                </Nav>
              )}
            </div>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

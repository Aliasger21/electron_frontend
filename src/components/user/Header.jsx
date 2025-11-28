// src/components/header/Header.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navbar, Nav, Container, Badge, NavDropdown, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { DEFAULT_AVATAR_URL } from "../../config";
import EdButton from "../ui/button";

const MOBILE_BREAKPOINT = 767;
const CART_PANEL_MAX_HEIGHT = 420;

const mobileCartStyles = `
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    #cart-dropdown .dropdown-menu { box-shadow: none; border: none; background: transparent; padding: 0; }
    .cart-dropdown-panel {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      padding: 12px;
    }
    .cart-dropdown-panel .inner-scroll { overflow-y: auto; padding-right: 6px; }
  }
`;

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export default function Header() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartPanelStyle, setCartPanelStyle] = useState(null);

  const cartRef = useRef(null);
  const panelRef = useRef(null);
  const profileRef = useRef(null);

  // memoized user -> updates only when authChanged event fires (or component mounts)
  const [userState, setUserState] = useState(() => safeParseUser());
  const user = userState;

  useEffect(() => {
    const onAuth = () => setUserState(safeParseUser());
    window.addEventListener("authChanged", onAuth);
    return () => window.removeEventListener("authChanged", onAuth);
  }, []);

  // close panels on route change
  useEffect(() => {
    setExpanded(false);
    setCartOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
    setExpanded(false);
  }, [navigate]);

  const subtotal = useMemo(() => {
    return (cart || []).reduce(
      (s, it) => s + Number(it.price || 0) * Number(it.qty || 1),
      0
    );
  }, [cart]);

  const isTouchDevice = useCallback(() => {
    try {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    } catch {
      return false;
    }
  }, []);

  const isMobileWidth = useCallback(() => {
    try {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    } catch {
      return true;
    }
  }, []);

  const isActivePointerOutside = (ref, relatedTarget) =>
    !ref.current || !ref.current.contains(relatedTarget);

  // hover handlers (desktop only)
  const onCartMouseEnter = () => {
    if (!isTouchDevice() && !isMobileWidth()) setCartOpen(true);
  };
  const onCartMouseLeave = (e) => {
    if (!isTouchDevice() && !isMobileWidth() && isActivePointerOutside(cartRef, e.relatedTarget)) {
      setCartOpen(false);
    }
  };

  const onProfileMouseEnter = () => {
    if (!isTouchDevice() && !isMobileWidth()) setProfileOpen(true);
  };
  const onProfileMouseLeave = (e) => {
    if (!isTouchDevice() && !isMobileWidth() && isActivePointerOutside(profileRef, e.relatedTarget)) {
      setProfileOpen(false);
    }
  };

  // escape to close
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "Escape") {
        setCartOpen(false);
        setProfileOpen(false);
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // compute fixed panel style for small screens so panel fits viewport
  const computeCartPanelStyle = useCallback(() => {
    try {
      const winW = window.innerWidth;
      if (!cartRef.current || !panelRef.current || winW > MOBILE_BREAKPOINT) {
        setCartPanelStyle(null);
        return;
      }

      const btnRect = cartRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const maxPanelH = Math.min(CART_PANEL_MAX_HEIGHT, Math.floor(viewportH * 0.7));
      const desiredTop = Math.ceil(btnRect.bottom + 8);
      const maxTop = Math.max(8, viewportH - maxPanelH - 12);
      const top = Math.min(desiredTop, maxTop);

      setCartPanelStyle({
        position: "fixed",
        left: "8px",
        right: "8px",
        top: `${top}px`,
        zIndex: 1100,
        maxWidth: "none",
        width: "auto",
        maxHeight: `${maxPanelH}px`,
        overflow: "visible",
      });
    } catch {
      setCartPanelStyle(null);
    }
  }, []);

  useEffect(() => {
    if (cartOpen) computeCartPanelStyle();
  }, [cartOpen, computeCartPanelStyle, expanded]);

  useEffect(() => {
    const onResize = () => {
      if (cartOpen) computeCartPanelStyle();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [cartOpen, computeCartPanelStyle]);

  const onCartClickMobile = (e) => {
    e.preventDefault();
    setCartOpen(true);
  };

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
      <style>{mobileCartStyles}</style>

      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4"
          style={{ color: "var(--accent)" }}
          onClick={() => setExpanded(false)}
        >
          Electron<span style={{ color: "var(--text)" }}>.store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="gap-3 align-items-center">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={() => setExpanded(false)}>Products</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={() => setExpanded(false)}>About</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)}>Contact</Nav.Link>

            <div ref={cartRef} onMouseEnter={onCartMouseEnter} onMouseLeave={onCartMouseLeave} style={{ position: "relative" }}>
              <NavDropdown
                title={
                  <a
                    href="#cart"
                    onClick={(e) => {
                      if (isTouchDevice() || isMobileWidth()) return onCartClickMobile(e);
                    }}
                    className="d-inline-flex align-items-center"
                    aria-hidden
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Cart
                    <Badge bg="danger" pill style={{ marginLeft: 6, minWidth: 28, textAlign: "center" }}>
                      {cart?.length || 0}
                    </Badge>
                  </a>
                }
                id="cart-dropdown"
                align="end"
                show={cartOpen}
                onToggle={(next) => setCartOpen(next)}
                menuVariant="dark"
                renderMenuOnMount
              >
                <div
                  ref={panelRef}
                  className="cart-dropdown-panel p-2"
                  style={{
                    minWidth: 300,
                    maxWidth: 420,
                    ...(cartPanelStyle || {}),
                    visibility: isMobileWidth() && !cartOpen ? "hidden" : "visible",
                  }}
                >
                  {(!cart || cart.length === 0) ? (
                    <div className="text-center py-4">
                      <div style={{ fontSize: 22, marginBottom: 6 }}>🛒</div>
                      <div style={{ color: "var(--text)", fontWeight: 600 }}>Your cart is empty</div>
                      <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
                        Looks like you haven't added anything yet.
                      </div>
                      <div className="mt-3">
                        <Button as={Link} to="/products" variant="outline-light" size="sm" onClick={() => setCartOpen(false)}>
                          Browse Products
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="inner-scroll" style={{ maxHeight: 300 }}>
                        {cart.slice(0, 8).map((it) => (
                          <div
                            key={it._id || it.id}
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              padding: "10px 6px",
                              borderRadius: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                borderRadius: 8,
                                overflow: "hidden",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                src={it.image || DEFAULT_AVATAR_URL}
                                alt={it.productname}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  color: "#fff",
                                  fontSize: 14,
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
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
                            <Button as={Link} to="/cart" variant="light" style={{ minWidth: 92 }} onClick={() => setCartOpen(false)}>
                              View Cart
                            </Button>
                            <EdButton as={Link} to="/checkout" variant="primary" style={{ minWidth: 92 }} onClick={() => setCartOpen(false)}>
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

            <div ref={profileRef} onMouseEnter={onProfileMouseEnter} onMouseLeave={onProfileMouseLeave} style={{ position: "relative" }}>
              {user ? (
                <NavDropdown
                  id="user-dropdown"
                  align="end"
                  show={profileOpen}
                  onToggle={(next) => setProfileOpen(next)}
                  title={
                    <span className="d-flex align-items-center gap-2" aria-hidden>
                      <img src={user.profilePic || DEFAULT_AVATAR_URL} alt="user" className="avatar-xxs" />
                      <span style={{ color: "#fff", fontWeight: 600 }}>{user.firstname || user.email}</span>
                    </span>
                  }
                  menuVariant="dark"
                  renderMenuOnMount
                >
                  <div style={{ minWidth: 240, maxWidth: 320, padding: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                        <img src={user.profilePic || DEFAULT_AVATAR_URL} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "var(--text)", fontWeight: 700 }}>{user.firstname || user.name || user.email}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email || ""}</div>
                      </div>
                    </div>

                    <hr style={{ borderColor: "rgba(255,255,255,0.04)", margin: "12px 0" }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <Button as={Link} to="/profile" variant="light" size="sm" onClick={() => setProfileOpen(false)}>
                        View Profile
                      </Button>
                      <Button as={Link} to="/orders" variant="outline-light" size="sm" onClick={() => setProfileOpen(false)}>
                        My Orders
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => { handleLogout(); setProfileOpen(false); }}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </NavDropdown>
              ) : (
                <Nav className="ms-2 gap-2 align-items-center">
                  <Nav.Link as={Link} to="/login" onClick={() => setProfileOpen(false)}>Login</Nav.Link>
                </Nav>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

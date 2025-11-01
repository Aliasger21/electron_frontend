import { Navbar, Nav, Container, Badge, NavDropdown, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";

const Header = () => {
    const { cart } = useCart();
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) || null } catch { return null }
    });
    const navigate = useNavigate();

    useEffect(() => {
        const onAuth = () => {
            try { setUser(JSON.parse(localStorage.getItem('user')) || null) } catch { setUser(null) }
        }
        window.addEventListener('authChanged', onAuth);
        return () => window.removeEventListener('authChanged', onAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChanged'));
        navigate('/');
    }

    return (
        <Navbar
            expand="lg"
            variant="dark"
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
                >
                    Electron<span style={{ color: "var(--text)" }}>.store</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="gap-3 align-items-center">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/products">Products</Nav.Link>
                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                    <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

                    <NavDropdown
                        title={<span>Cart <Badge bg="danger" pill style={{ marginLeft: 6 }}>{cart.length}</Badge></span>}
                        id="cart-dropdown"
                        align="end"
                    >
                        {cart.length === 0 ? (
                            <NavDropdown.ItemText>Your cart is empty</NavDropdown.ItemText>
                        ) : (
                            <div style={{ minWidth: 300 }}>
                                {cart.slice(0, 5).map((it) => (
                                    <NavDropdown.ItemText key={it._id} className="d-flex align-items-center gap-2">
                                        <Image src={it.image || 'https://via.placeholder.com/50'} rounded style={{ width: 50, height: 50, objectFit: 'contain' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#fff', fontSize: '0.9rem' }}>{it.productname}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Qty: {it.qty}</div>
                                        </div>
                                        <div style={{ color: 'var(--accent)' }}>₹{(it.price*it.qty).toFixed(0)}</div>
                                    </NavDropdown.ItemText>
                                ))}
                                <NavDropdown.Divider />
                                <div className="px-3 py-2 d-flex gap-2">
                                    <Button as={Link} to="/cart" variant="light" style={{ flex: 1 }}>View Cart</Button>
                                    <Button as={Link} to="/checkout" style={{ backgroundColor: 'var(--accent)', border: 'none' }}>Checkout</Button>
                                </div>
                            </div>
                        )}
                    </NavDropdown>
                
                {user ? (
                    <Nav className="ms-2">
                        <NavDropdown
                            id="user-dropdown"
                            align="end"
                            title={
                                <span className="d-flex align-items-center gap-2">
                                    <Image src={user.profilePic || 'https://via.placeholder.com/40'} roundedCircle style={{ width: 36, height: 36, objectFit: 'cover' }} />
                                    <span style={{ color: '#fff', fontWeight: 600 }}>{user.firstname || user.email}</span>
                                </span>
                            }
                        >
                            <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/orders">My Orders</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                ) : (
                    <Nav className="ms-2 gap-2 align-items-center">
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    </Nav>
                )}

                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

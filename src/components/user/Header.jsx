import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
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
                    <Nav className="gap-3">
                        {["Home", "Products", "About", "Contact"].map((item) => (
                            <Nav.Link
                                key={item}
                                as={Link}
                                to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                                style={{
                                    color: "var(--text-muted)",
                                    fontWeight: "500",
                                    transition: "all 0.2s ease",
                                    position: "relative",
                                }}
                                className="nav-hover"
                            >
                                {item}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

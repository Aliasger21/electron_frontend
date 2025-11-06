import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="align-items-start mb-5">
        <Col md={7} className="mb-4">
          <h1 style={{ color: '#fff', fontWeight: 800 }}>
            About <span style={{ color: 'var(--accent)' }}>Electron</span><span style={{ color: '#ffffff' }}>.store</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Electron.store is your trusted electronics marketplace — built to help people find
            high-quality devices and accessories at great prices. We combine curated product
            selection, transparent pricing and reliable support to make shopping effortless.
          </p>

          <h5 style={{ color: '#fff', marginTop: 18 }}>What we offer</h5>
          <ul style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <li>Curated electronics from reputable brands</li>
            <li>Clear pricing, secure checkout and simple returns</li>
            <li>Fast dispatch and responsive customer support</li>
          </ul>

          <div className="mt-3">
            <Button as={Link} to="/products" className="btn-accent">Browse Products</Button>
            <Button as={Link} to="/contact" variant="outline-light" className="ms-2">Contact Us</Button>
          </div>
        </Col>

        <Col md={5} className="mb-4">
          <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <Card.Body>
              <h5 style={{ color: '#fff' }}>Our Mission</h5>
              <p style={{ color: 'var(--text-muted)' }}>
                To make dependable electronics accessible, and to create a simple, trustworthy
                shopping experience that customers enjoy returning to.
              </p>
              <h5 style={{ color: '#fff', marginTop: 12 }}>Our Values</h5>
              <p style={{ color: 'var(--text-muted)' }}>
                We value transparency, product authenticity, and quick helpful support. Every
                decision is guided by what benefits the customer.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <h4 style={{ color: '#fff' }}>How we source products</h4>
          <p style={{ color: 'var(--text-muted)' }}>We partner directly with brands and vetted distributors to ensure authenticity and warranty support.</p>
        </Col>
        <Col md={4} className="mb-3">
          <h4 style={{ color: '#fff' }}>Support</h4>
          <p style={{ color: 'var(--text-muted)' }}>Our support team is available through the <Link to="/contact">Contact page</Link>.</p>
        </Col>
        <Col md={4} className="mb-3">
          <h4 style={{ color: '#fff' }}>Careers</h4>
          <p style={{ color: 'var(--text-muted)' }}>We're growing — please visit our <Link to="/contact">Contact page</Link> to get in touch about opportunities.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;



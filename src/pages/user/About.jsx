// src/pages/user/About.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EdButton from '../../components/ui/button';
import EdCard from '../../components/ui/Card';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="align-items-start mb-5">
        <Col md={7} className="mb-4">
          <h1>
            About <span style={{ color: 'var(--accent)' }}>Electron</span>
            <span>.store</span>
          </h1>

          <p className="text-muted">
            Electron.store is your trusted electronics marketplace — built to help people
            find high-quality devices and accessories at great prices. We offer curated
            product selection, transparent pricing and a seamless shopping experience.
          </p>

          <h5>What we offer</h5>
          <ul className="text-muted">
            <li>Curated electronics from trusted brands</li>
            <li>Secure checkout & simple returns</li>
            <li>Fast delivery with responsive support</li>
          </ul>

          <div className="mt-3 d-flex gap-2 flex-wrap">
            <Link to="/products">
              <EdButton>Browse Products</EdButton>
            </Link>
            <Link to="/contact">
              <EdButton variant="outline">Contact Us</EdButton>
            </Link>
          </div>
        </Col>

        <Col md={5} className="mb-4">
          <EdCard>
            <h5>Our Mission</h5>
            <p className="text-muted">
              To make reliable electronics accessible to everyone while offering an
              enjoyable and simple shopping experience.
            </p>

            <h5>Our Values</h5>
            <p className="text-muted">
              Transparency, authenticity, and customer-first service. Every decision is
              based on providing the best value to our customers.
            </p>
          </EdCard>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <EdCard>
            <h4>How we source products</h4>
            <p className="text-muted">
              We partner directly with verified brands and authorized distributors to
              ensure authenticity and warranty support.
            </p>
          </EdCard>
        </Col>

        <Col md={4} className="mb-3">
          <EdCard>
            <h4>Support</h4>
            <p className="text-muted">
              Our support team is available through the{' '}
              <Link to="/contact">Contact page</Link>.
            </p>
          </EdCard>
        </Col>

        <Col md={4} className="mb-3">
          <EdCard>
            <h4>Careers</h4>
            <p className="text-muted">
              We're expanding! Visit the <Link to="/contact">Contact page</Link> to reach
              out for opportunities.
            </p>
          </EdCard>
        </Col>
      </Row>
    </Container>
  );
};

export default About;

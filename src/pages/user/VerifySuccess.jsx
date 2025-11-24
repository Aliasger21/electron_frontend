import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const VerifySuccess = () => {
  return (
    <Container className="py-5 text-center">
      <div style={{ maxWidth: 700, margin: '0 auto', background: 'var(--bg-card)', padding: 24, borderRadius: 8 }}>
        <h2 style={{ color: '#fff' }}>Email Verified</h2>
        <p style={{ color: 'var(--text-muted)' }}>Thank you — your email has been successfully verified. You can now log in and start shopping.</p>
        <div className="d-flex justify-content-center gap-2">
          <Button as={Link} to="/login" variant="light">Log in</Button>
          <Link to="/">
            <EdButton>Continue Shopping</EdButton>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default VerifySuccess;



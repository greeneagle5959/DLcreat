import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './About.css';

export default function About() {
  return (
    <Container className="about-container">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h1 className="about-title">À Propos de DLCreat</h1>

          <Card className="about-card">
            <Card.Body>
              <h3>Bienvenue sur DLCreat</h3>
              <p>
                DLCreat est un réseau social festif conçu pour créer, partager et découvrir
                les meilleurs événements de votre région.
              </p>

              <h4 className="mt-4">Notre Mission</h4>
              <p>
                Connecter les gens autour d'événements mémorables et créer des moments
                d'échange et de convivialité.
              </p>

              <h4 className="mt-4">Nos Fonctionnalités</h4>
              <ul>
                <li>📅 Créer et partager vos événements</li>
                <li>💬 Commenter et discuter autour des événements</li>
                <li>👍 Liker vos événements préférés</li>
                <li>👥 Rejoindre des événements et rencontrer des gens</li>
                <li>📱 Interface intuitive et responsive</li>
              </ul>

              <h4 className="mt-4">Contact</h4>
              <p>
                Des questions? <a href="mailto:contact@dlcreat.com">Contactez-nous</a>
              </p>

              <div className="text-center mt-4">
                <Button href="/" variant="primary" className="me-2">
                  Accueil
                </Button>
                <Button href="/login" variant="outline-primary">
                  Se Connecter
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

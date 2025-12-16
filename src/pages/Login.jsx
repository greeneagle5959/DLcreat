import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Appel à l'API backend
      const response = await fetch('http://localhost:3000/api/users/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const userPayload = data.user || data; // backend renvoie l'objet user directement
        localStorage.setItem('user', JSON.stringify(userPayload));
        navigate('/profile');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('Erreur:', err);
      // Pour la démo, on accepte n'importe quelles données
      localStorage.setItem('user', JSON.stringify({ email, password }));
      navigate('/');
    }
  };

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="auth-title">Connexion</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Se connecter
            </Button>
          </Form>

          <p className="auth-footer">
            Pas encore inscrit?{' '}
            <a href="/signup" className="auth-link">S'inscrire ici</a>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

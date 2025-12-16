import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.nom || !formData.prenom) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Appel à l'API backend (création + session auto)
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        const userPayload = data.user || formData;
        localStorage.setItem('user', JSON.stringify(userPayload));
        navigate('/profile');
      } else {
        setError('Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur:', err);
      // Pour la démo (fallback si backend indisponible)
      localStorage.setItem('user', JSON.stringify({ ...formData, id: Date.now() }));
      navigate('/profile');
    }
  };

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="auth-title">S'inscrire</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Votre prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Votre nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Votre email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Créez un mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mb-3">
              S'inscrire
            </Button>
          </Form>

          <p className="auth-footer">
            Vous avez un compte?{' '}
            <a href="/login" className="auth-link">Se connecter ici</a>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

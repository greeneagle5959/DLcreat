import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import './CreateEvent.css';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!formData.titre || !formData.date_debut || !formData.lieu) {
      setError('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user?.id || 1
        })
      });

      if (response.ok) {
        navigate('/');
      } else {
        setError('Erreur lors de la création de l\'événement');
      }
    } catch (err) {
      console.error('Erreur:', err);
      navigate('/');
    }
  };

  return (
    <Container className="create-event-container">
      <Card className="create-event-card">
        <Card.Body>
          <h2 className="create-event-title">Créer un Événement</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleCreateEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Titre de l'événement *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Soirée Festive"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Décrivez votre événement..."
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lieu *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Paris"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de début *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mb-3">
              Créer l'Événement
            </Button>
          </Form>

          <div className="text-center">
            <a href="/" className="text-muted">Retour à l'accueil</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

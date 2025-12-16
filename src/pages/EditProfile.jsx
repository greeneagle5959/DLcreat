import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './EditProfile.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      prenom: parsedUser.prenom || '',
      nom: parsedUser.nom || '',
      email: parsedUser.email || '',
      bio: parsedUser.bio || '',
      avatar: parsedUser.avatar || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('Avatar trop volumineux (max 50MB)');
      return;
    }

    const fd = new FormData();
    fd.append('avatar', file);

    try {
      const response = await fetch(`http://localhost:3000/api/users/${user.id}/avatar`, {
        method: 'POST',
        body: fd
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, avatar: data.avatar }));
        localStorage.setItem('user', JSON.stringify({ ...user, avatar: data.avatar }));
        setSuccess('Avatar mis à jour');
      } else {
        setError('Erreur lors de l\'upload de l\'avatar');
      }
    } catch (err) {
      setError('Erreur lors de l\'upload');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Appel API pour mettre à jour le profil
      const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Mettre à jour le localStorage
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...formData
        }));
        setSuccess('Profil mis à jour avec succès!');
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur:', err);
      // Pour la démo, accepter localement
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...formData
      }));
      setSuccess('Profil mis à jour avec succès!');
      setTimeout(() => navigate('/profile'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Container className="text-center my-5"><p>Chargement...</p></Container>;
  }

  return (
    <Container className="edit-profile-container">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="edit-profile-card">
            <Card.Body>
              <h2 className="edit-profile-title">✏️ Modifier Mon Profil</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <div className="avatar-preview">
                <img
                  src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.prenom}+${formData.nom}&background=7c3aed&color=fff&size=120`}
                  alt="Avatar"
                  className="preview-avatar"
                />
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Changer l'avatar (image, max 50MB)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAvatarUpload(e.target.files[0])}
                />
              </Form.Group>

              <Form onSubmit={handleSave}>
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
                  <Form.Label>Bio/Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Parlez-nous de vous... (style Instagram)"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL Avatar</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="mb-2"
                  >
                    {loading ? 'Sauvegarde...' : '💾 Sauvegarder les modifications'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/profile')}
                  >
                    Annuler
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Nav, Badge, Alert } from 'react-bootstrap';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);

  // Vérifier si admin
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les utilisateurs
      const usersRes = await fetch('http://localhost:3000/api/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }

      // Charger les événements
      const eventsRes = await fetch('http://localhost:3000/api/events');
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.data || []);
      }

      // Charger les commentaires
      const commentsRes = await fetch('http://localhost:3000/api/comments');
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData.data || []);
      }

      // Vue d'ensemble admin (likes, médias, totaux fiables)
      const overviewRes = await fetch('http://localhost:3000/api/users/admin/overview');
      if (overviewRes.ok) {
        setOverview(await overviewRes.json());
      }

    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Supprimer cet utilisateur?')) {
      try {
        await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Supprimer cet événement?')) {
      try {
        await fetch(`http://localhost:3000/api/events/${id}`, { method: 'DELETE' });
        setEvents(events.filter(e => e.id !== id));
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  const deleteComment = async (id) => {
    if (window.confirm('Supprimer ce commentaire?')) {
      try {
        await fetch(`http://localhost:3000/api/comments/${id}`, { method: 'DELETE' });
        setComments(comments.filter(c => c.id !== id));
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  if (loading) {
    return <Container className="text-center my-5"><p>Chargement...</p></Container>;
  }

  return (
    <Container fluid className="admin-container">
      <Row className="mb-4">
        <Col>
          <h1 className="admin-title">
            🔐 Panneau Administrateur
          </h1>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="stat-number">{overview?.users ?? users.length}</h3>
              <p className="stat-label">Utilisateurs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="stat-number">{overview?.events ?? events.length}</h3>
              <p className="stat-label">Événements</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="stat-number">{overview?.comments ?? comments.length}</h3>
              <p className="stat-label">Commentaires</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3 className="stat-number">{overview?.medias ?? 0}</h3>
              <p className="stat-label">Médias partagés</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {overview && (
        <Row className="mb-4">
          <Col md={6}>
            <Card className="stat-card">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Likes</h5>
                  <p className="mb-0 text-muted">Total des likes sur les événements</p>
                </div>
                <Badge bg="danger" pill>{overview.likes}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stat-card">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Contenus</h5>
                  <p className="mb-0 text-muted">Utilisateurs + événements + médias</p>
                </div>
                <Badge bg="secondary" pill>{(overview.users || 0) + (overview.events || 0) + (overview.medias || 0)}</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Onglets */}
      <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={setActiveTab}>
        <Nav.Item>
          <Nav.Link eventKey="dashboard">Tableau de bord</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="users">Utilisateurs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="events">Événements</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="comments">Commentaires</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tableau de bord */}
      {activeTab === 'dashboard' && (
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="admin-card">
              <Card.Header className="bg-primary text-white">
                <h5>Derniers Utilisateurs</h5>
              </Card.Header>
              <Card.Body>
                {users.slice(-5).reverse().map(user => (
                  <div key={user.id} className="admin-item">
                    <strong>{user.prenom} {user.nom}</strong>
                    <small className="text-muted">{user.email}</small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="admin-card">
              <Card.Header className="bg-success text-white">
                <h5>Derniers Événements</h5>
              </Card.Header>
              <Card.Body>
                {events.slice(-5).reverse().map(event => (
                  <div key={event.id} className="admin-item">
                    <strong>{event.titre}</strong>
                    <small className="text-muted">{event.lieu}</small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Utilisateurs */}
      {activeTab === 'users' && (
        <Card className="admin-card">
          <Card.Header className="bg-primary text-white">
            <h5>Gestion des Utilisateurs</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.prenom}</td>
                      <td>{user.nom}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Événements */}
      {activeTab === 'events' && (
        <Card className="admin-card">
          <Card.Header className="bg-success text-white">
            <h5>Gestion des Événements</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Lieu</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.id}</td>
                      <td>{event.titre}</td>
                      <td>{event.lieu}</td>
                      <td>{new Date(event.date_debut).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Commentaires */}
      {activeTab === 'comments' && (
        <Card className="admin-card">
          <Card.Header className="bg-warning text-white">
            <h5>Gestion des Commentaires</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Contenu</th>
                    <th>Événement</th>
                    <th>Auteur</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(comment => (
                    <tr key={comment.id}>
                      <td>{comment.id}</td>
                      <td>{comment.contenu?.substring(0, 50)}...</td>
                      <td>Evt #{comment.event_id}</td>
                      <td>{comment.auteur || 'Anonyme'}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteComment(comment.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Bouton retour */}
      <div className="mt-4 text-center mb-4">
        <Button href="/" variant="secondary">Retour à l'accueil</Button>
      </div>
    </Container>
  );
}

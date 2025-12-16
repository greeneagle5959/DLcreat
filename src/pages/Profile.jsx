import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ events: 0, participations: 0, likes: 0, comments: 0 });
  const [myEvents, setMyEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Vérifier si c'est le compte admin
      if (parsedUser.email === 'donogreeneagle@gmail.com') {
        setIsAdmin(true);
      }

      // Charger les statistiques liées à l'utilisateur
      fetch(`http://localhost:3000/api/users/${parsedUser.id}/summary`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setStats(data);
        })
        .catch(() => {});

      // Charger les événements liés (créés, participation, likes)
      fetch(`http://localhost:3000/api/events/user/${parsedUser.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(setMyEvents)
        .catch(() => {});

      fetch(`http://localhost:3000/api/events/participating/${parsedUser.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(setParticipatingEvents)
        .catch(() => {});

      fetch(`http://localhost:3000/api/events/liked/${parsedUser.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(setLikedEvents)
        .catch(() => {});

      fetch(`http://localhost:3000/api/users/followers/${parsedUser.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(setFollowers)
        .catch(() => {});

      fetch(`http://localhost:3000/api/users/following/${parsedUser.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(setFollowing)
        .catch(() => {});
    }
  }, []);

  if (!user) {
    return (
      <Container className="text-center my-5">
        <h2>Veuillez vous connecter</h2>
        <Button href="/login" variant="primary">Connexion</Button>
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="profile-card">
            <Card.Body>
              <div className="profile-header">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=7c3aed&color=fff&size=120`}
                  alt="Avatar"
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <h2>{user.prenom} {user.nom}</h2>
                  <p className="text-muted">{user.email}</p>
                  {isAdmin && <Badge bg="danger">🔐 ADMIN</Badge>}
                  {user.bio && <p className="profile-bio">{user.bio}</p>}
                </div>
              </div>

              <hr />

              <h4>Statistiques</h4>
              <Row className="mb-4">
                <Col md={3} className="text-center">
                  <h3 className="stat-number">{stats.events}</h3>
                  <p className="stat-label">Événements</p>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="stat-number">{stats.participations}</h3>
                  <p className="stat-label">Participants</p>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="stat-number">{stats.likes}</h3>
                  <p className="stat-label">Likes</p>
                </Col>
                <Col md={3} className="text-center">
                  <h3 className="stat-number">{stats.comments}</h3>
                  <p className="stat-label">Commentaires</p>
                </Col>
              </Row>

              <h4>Réseau</h4>
              <Row className="mb-4">
                <Col md={6} className="text-center">
                  <h3 className="stat-number">{followers.length}</h3>
                  <p className="stat-label">Abonnés</p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {followers.slice(0, 6).map((f) => (
                      <Badge bg="light" text="dark" key={f.id} className="p-2">
                        {f.prenom} {f.nom}
                      </Badge>
                    ))}
                    {followers.length > 6 && (
                      <Badge bg="secondary">+{followers.length - 6}</Badge>
                    )}
                  </div>
                </Col>
                <Col md={6} className="text-center">
                  <h3 className="stat-number">{following.length}</h3>
                  <p className="stat-label">Abonnements</p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {following.slice(0, 6).map((f) => (
                      <Badge bg="light" text="dark" key={f.id} className="p-2">
                        {f.prenom} {f.nom}
                      </Badge>
                    ))}
                    {following.length > 6 && (
                      <Badge bg="secondary">+{following.length - 6}</Badge>
                    )}
                  </div>
                </Col>
              </Row>

              <div className="mt-4">
                <Button
                  href="/"
                  variant="primary"
                  className="me-2"
                >
                  Accueil
                </Button>
                <Button
                  onClick={() => navigate('/edit-profile')}
                  variant="info"
                  className="me-2"
                >
                  ✏️ Modifier le profil
                </Button>
                <Button href="/create-event" variant="success" className="me-2">
                  Créer un Événement
                </Button>
                {isAdmin && (
                  <Button
                    onClick={() => navigate('/admin')}
                    variant="danger"
                  >
                    🔐 Panneau Admin
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Mes événements */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>Mes événements ({myEvents.length})</Card.Header>
            <Card.Body>
              {myEvents.length === 0 ? (
                <p className="text-muted">Aucun événement créé.</p>
              ) : (
                myEvents.map(ev => (
                  <div key={ev.id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{ev.titre}</h5>
                        <small className="text-muted">{new Date(ev.date_debut).toLocaleDateString('fr-FR')} • {ev.lieu}</small>
                      </div>
                      <Button size="sm" variant="outline-primary" onClick={() => navigate(`/event/${ev.id}`)}>
                        Voir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Événements où je participe */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>Événements où je participe ({participatingEvents.length})</Card.Header>
            <Card.Body>
              {participatingEvents.length === 0 ? (
                <p className="text-muted">Aucune participation pour le moment.</p>
              ) : (
                participatingEvents.map(ev => (
                  <div key={ev.id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{ev.titre}</h5>
                        <small className="text-muted">{new Date(ev.date_debut).toLocaleDateString('fr-FR')} • {ev.lieu}</small>
                      </div>
                      <Button size="sm" variant="outline-success" onClick={() => navigate(`/event/${ev.id}`)}>
                        Voir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Événements likés */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>Événements likés ({likedEvents.length})</Card.Header>
            <Card.Body>
              {likedEvents.length === 0 ? (
                <p className="text-muted">Aucun like pour le moment.</p>
              ) : (
                likedEvents.map(ev => (
                  <div key={ev.id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{ev.titre}</h5>
                        <small className="text-muted">{new Date(ev.date_debut).toLocaleDateString('fr-FR')} • {ev.lieu}</small>
                      </div>
                      <Button size="sm" variant="outline-danger" onClick={() => navigate(`/event/${ev.id}`)}>
                        Voir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [medias, setMedias] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [participating, setParticipating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [organizerFollowers, setOrganizerFollowers] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    loadEventDetails();
  }, [id, user?.id]);

  const loadEventDetails = async () => {
    try {
      const [eventRes, commentsRes, mediasRes] = await Promise.all([
        fetch(`http://localhost:3000/api/events/${id}`),
        fetch(`http://localhost:3000/api/comments/event/${id}`),
        fetch(`http://localhost:3000/api/engagement/media/event/${id}`)
      ]);

      let eventData = null;
      if (eventRes.ok) {
        eventData = await eventRes.json();
        setEvent(eventData);
      }
      if (commentsRes.ok) {
        setComments(await commentsRes.json());
      }
      if (mediasRes.ok) {
        setMedias(await mediasRes.json());
      }

      if (user) {
        const statusRes = await fetch(`http://localhost:3000/api/engagement/${user.id}/${id}`);
        if (statusRes.ok) {
          const status = await statusRes.json();
          setLiked(status.liked);
          setParticipating(status.participating);
        }
      }

      if (user && eventData) {
        await loadSocialData(user.id, eventData.user_id);
      }
    } catch (err) {
      setError('Erreur lors du chargement de l\'événement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSocialData = async (viewerId, organizerId) => {
    try {
      const [followersRes, followingRes, mutualRes] = await Promise.all([
        fetch(`http://localhost:3000/api/users/followers/${organizerId}`),
        fetch(`http://localhost:3000/api/users/following/${viewerId}`),
        fetch(`http://localhost:3000/api/users/mutual/${viewerId}/${organizerId}`)
      ]);

      const followersData = followersRes.ok ? await followersRes.json() : [];
      const followingData = followingRes.ok ? await followingRes.json() : [];
      const mutualData = mutualRes.ok ? await mutualRes.json() : [];

      setOrganizerFollowers(followersData.length || 0);
      setIsFollowing(followingData.some((u) => Number(u.id) === Number(organizerId)));
      setMutualFriends(mutualData);
    } catch (err) {
      // Pas bloquant pour l'affichage principal
      console.error('Erreur réseau social', err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setError('Veuillez vous connecter');
      return;
    }

    try {
      if (liked) {
        await fetch(`http://localhost:3000/api/engagement/like/${user.id}/${id}`, { method: 'DELETE' });
        setLiked(false);
      } else {
        await fetch('http://localhost:3000/api/engagement/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, event_id: id })
        });
        setLiked(true);
      }
      loadEventDetails();
    } catch (err) {
      setError('Erreur avec le like');
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !event) {
      setError('Veuillez vous connecter');
      return;
    }

    const payload = { follower_id: user.id, followee_id: event.user_id };
    try {
      if (isFollowing) {
        await fetch('http://localhost:3000/api/users/follow', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('http://localhost:3000/api/users/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setIsFollowing(!isFollowing);
      await loadSocialData(user.id, event.user_id);
    } catch (err) {
      setError('Erreur lors du suivi');
    }
  };

  const handleJoin = async () => {
    if (!user) {
      setError('Veuillez vous connecter');
      return;
    }

    try {
      if (participating) {
        await fetch(`http://localhost:3000/api/engagement/join/${user.id}/${id}`, { method: 'DELETE' });
        setParticipating(false);
      } else {
        await fetch('http://localhost:3000/api/engagement/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, event_id: id })
        });
        setParticipating(true);
      }
      loadEventDetails();
    } catch (err) {
      setError('Erreur avec la participation');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Veuillez vous connecter');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenu: newComment,
          user_id: user.id,
          event_id: id
        })
      });

      if (res.ok) {
        setNewComment('');
        loadEventDetails();
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout du commentaire');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await fetch(`http://localhost:3000/api/comments/${commentId}`, { method: 'DELETE' });
      loadEventDetails();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleShareEvent = () => {
    const shareText = `Rejoignez moi à l'événement: ${event?.titre}\n${window.location.href}`;
    const url = window.location.href;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;

    if (navigator.share) {
      navigator.share({ title: event?.titre || 'Événement', text: shareText, url }).catch(() => {
        window.open(whatsappUrl, '_blank');
      });
    } else {
      window.open(whatsappUrl, '_blank');
    }

    // Ouvrir aussi un onglet Facebook/Twitter pour multi-share
    window.open(facebookUrl, '_blank');
    window.open(twitterUrl, '_blank');
  };

  const handleUploadMedia = async (file) => {
    if (!user) {
      setError('Veuillez vous connecter');
      return;
    }
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 500MB)');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('user_id', user.id);
      fd.append('event_id', id);

      const res = await fetch('http://localhost:3000/api/engagement/media/upload', {
        method: 'POST',
        body: fd
      });

      if (res.ok) {
        await loadEventDetails();
      } else {
        setError('Erreur lors de l\'upload du média');
      }
    } catch (err) {
      setError('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="text-center my-5">
        <h2>Événement non trouvé</h2>
      </Container>
    );
  }

  return (
    <Container className="event-detail-container my-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="event-card mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2>{event.titre}</h2>
                  <p className="text-muted">Par {event.prenom} {event.nom}</p>
                </div>
                {event.avatar && (
                  <img src={event.avatar} alt="Avatar" className="rounded-circle" width="50" />
                )}
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-details mb-3">
                <p><strong>📍 Lieu:</strong> {event.lieu}</p>
                <p><strong>📅 Date:</strong> {new Date(event.date_debut).toLocaleDateString('fr-FR')}</p>
                <p><strong>⏰ Heure:</strong> {new Date(event.date_debut).toLocaleTimeString('fr-FR')}</p>
              </div>

              <div className="engagement-stats mb-3">
                <Badge bg="info" className="me-2">
                  👥 {event.nb_participants || 0} participants
                </Badge>
                <Badge bg="danger" className="me-2">
                  ❤️ {event.nb_likes || 0} likes
                </Badge>
                <Badge bg="primary">
                  💬 {comments.length} commentaires
                </Badge>
              </div>

              {user && event.user_id && user.id !== event.user_id && (
                <div className="mb-3 d-flex align-items-center flex-wrap gap-2">
                  <Badge bg="secondary">👥 {organizerFollowers} abonnés</Badge>
                  <Button
                    variant={isFollowing ? 'outline-secondary' : 'secondary'}
                    size="sm"
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? 'Se désabonner' : "S'abonner"}
                  </Button>
                </div>
              )}

              <div className="action-buttons mb-3">
                <Button
                  variant={liked ? 'danger' : 'outline-danger'}
                  onClick={handleLike}
                  className="me-2"
                >
                  {liked ? '❤️ Aimé' : '🤍 Aimer'}
                </Button>
                <Button
                  variant={participating ? 'success' : 'outline-success'}
                  onClick={handleJoin}
                  className="me-2"
                >
                  {participating ? '✓ Inscrit' : '📝 Participer'}
                </Button>
                <Button
                  variant="info"
                  onClick={handleShareEvent}
                >
                  📤 Partager
                </Button>
              </div>

              {user && (
                <div className="mb-3">
                  <h6>Ajouter un média (image/vidéo, max 500MB)</h6>
                  <Form.Control
                    type="file"
                    accept="image/*,video/*"
                    disabled={uploading}
                    onChange={(e) => handleUploadMedia(e.target.files[0])}
                  />
                  {uploading && <small className="text-muted">Upload en cours...</small>}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Médias */}
          {medias.length > 0 && (
            <Card className="mb-4">
              <Card.Header className="bg-secondary text-white">
                📸 Médias ({medias.length})
              </Card.Header>
              <Card.Body>
                <Row>
                  {medias.map(media => (
                    <Col md={6} key={media.id} className="mb-3">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Media" className="img-fluid rounded" />
                      ) : (
                        <video src={media.url} controls className="w-100 rounded" />
                      )}
                      <small className="text-muted">Par {media.prenom} {media.nom}</small>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Formulaire commentaire */}
          {user && (
            <Card className="mb-4">
              <Card.Body>
                <h5>Ajouter un commentaire</h5>
                <Form onSubmit={handleAddComment}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Votre commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={!newComment.trim()}>
                    💬 Commenter
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Commentaires */}
          <Card>
            <Card.Header className="bg-primary text-white">
              💬 Commentaires ({comments.length})
            </Card.Header>
            <Card.Body>
              {comments.length === 0 ? (
                <p className="text-muted">Aucun commentaire pour le moment</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <strong>{comment.prenom} {comment.nom}</strong>
                        <p className="mb-1">{comment.contenu}</p>
                        <small className="text-muted">
                          {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                        </small>
                      </div>
                      {user?.id === comment.user_id && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          🗑️
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          {user && event.user_id && user.id !== event.user_id && (
            <Card className="mt-3">
              <Card.Header className="bg-light">
                Amis en commun avec l'organisateur ({mutualFriends.length})
              </Card.Header>
              <Card.Body>
                {mutualFriends.length === 0 ? (
                  <p className="text-muted mb-0">Aucun ami en commun pour le moment.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-3">
                    {mutualFriends.map((friend) => (
                      <div key={friend.id} className="d-flex align-items-center gap-2">
                        {friend.avatar && (
                          <img src={friend.avatar} alt="Avatar" width="36" height="36" className="rounded-circle" />
                        )}
                        <span>{friend.prenom} {friend.nom}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

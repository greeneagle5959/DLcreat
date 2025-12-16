import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        // Fallback avec données de démo
        setEvents([
          {
            id: 1,
            titre: 'Concert de Musique Live',
            date_debut: '2024-12-15',
            lieu: 'Paris',
            description: 'Une soirée musicale inoubliable avec les meilleurs artistes',
            nb_participants: 125,
            nb_likes: 89
          },
          {
            id: 2,
            titre: 'Fête d\'Anniversaire Surprise',
            date_debut: '2024-12-18',
            lieu: 'Lyon',
            description: 'Rejoignez-nous pour célébrer en grand style',
            nb_participants: 45,
            nb_likes: 32
          },
          {
            id: 3,
            titre: 'Festival de Gastronomie',
            date_debut: '2024-12-20',
            lieu: 'Marseille',
            description: 'Découvrez les meilleures saveurs de la cuisine française',
            nb_participants: 200,
            nb_likes: 156
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="events-section">
      <div className="events-container">
        <h2>Événements à Découvrir</h2>
        <p className="events-subtitle">Trouvez et rejoignez des événements près de chez vous</p>

        {loading ? (
          <p className="text-center">Chargement des événements...</p>
        ) : (
          <div className="events-grid">
            {events.length === 0 ? (
              <p className="text-center">Aucun événement disponible</p>
            ) : (
              events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-image">🎉</div>
                  <div className="event-content">
                    <h3>{event.titre}</h3>
                    <p className="event-description">{event.description}</p>

                    <div className="event-meta">
                      <span className="meta-item">
                        📅 {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="meta-item">📍 {event.lieu}</span>
                    </div>

                    <div className="event-attendees">
                      <span className="attendees-count">👥 {event.nb_participants || 0} participants</span>
                      <span className="likes-count">❤️ {event.nb_likes || 0} likes</span>
                    </div>

                    <div className="event-actions">
                      <button
                        className="btn-details"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        Voir Détails
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

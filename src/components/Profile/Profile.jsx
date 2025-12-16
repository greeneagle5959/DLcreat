import React, { useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    avatar: '👤',
    bio: 'Passionné par les événements festifs et les rencontres',
    location: 'Paris, France',
    joinDate: '2024-01-15',
    events: 5,
    friends: 23
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>

        <div className="profile-info">
          <div className="profile-avatar">{user.avatar}</div>

          <div className="profile-details">
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-location">📍 {user.location}</p>
            <p className="profile-bio">{user.bio}</p>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{user.events}</span>
                <span className="stat-label">Événements</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.friends}</span>
                <span className="stat-label">Amis</span>
              </div>
              <div className="stat">
                <span className="stat-value">Membre</span>
                <span className="stat-label">depuis {new Date(user.joinDate).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Modifier le Profil
              </button>
            ) : (
              <button className="btn-save" onClick={handleSave}>
                ✅ Enregistrer
              </button>
            )}
            <button className="btn-settings">⚙️ Paramètres</button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="profile-edit-form">
          <h3>Modifier votre Profil</h3>

          <div className="form-group">
            <label>Nom Complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Localisation</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <button className="btn-cancel" onClick={() => setIsEditing(false)}>
            Annuler
          </button>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <h3>Mes Événements</h3>
          <div className="events-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="event-item">
                <span className="event-emoji">🎉</span>
                <div className="event-item-info">
                  <p className="event-item-title">Événement {i}</p>
                  <p className="event-item-date">Créé le 15 décembre 2024</p>
                </div>
                <button className="btn-view">Voir</button>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Mes Amis</h3>
          <div className="friends-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="friend-card">
                <div className="friend-avatar">👥</div>
                <p className="friend-name">Ami {i}</p>
                <button className="btn-remove">Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

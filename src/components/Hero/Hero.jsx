import React from 'react';
import './Hero.css';

export default function Hero({ isLoggedIn }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="logo">🎉</div>
        <h1>DLCreat</h1>
        <p className="subtitle">
          Le réseau social festif pour créer, partager et célébrer vos événements inoubliables
        </p>

        <div className="hero-actions">
          {isLoggedIn ? (
            <>
              <a href="/events" className="btn-hero btn-hero-primary">Découvrir les Événements</a>
              <a href="/create" className="btn-hero btn-hero-secondary">Créer un Événement</a>
            </>
          ) : (
            <>
              <a href="/signup" className="btn-hero btn-hero-primary">Commencer Gratuitement</a>
              <a href="/login" className="btn-hero btn-hero-secondary">Se Connecter</a>
            </>
          )}
        </div>

        <div className="hero-features">
          <div className="feature">
            <span className="feature-icon">🎊</span>
            <p>Créez des événements</p>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <p>Invitez vos amis</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <p>Communicquez ensemble</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📸</span>
            <p>Partagez les moments</p>
          </div>
        </div>
      </div>
    </section>
  );
}

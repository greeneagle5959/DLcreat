import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.prenom || userData.nom || 'Utilisateur');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')}>
          <img src="/logo/logo.ico" alt="Logo DLCreat" className="logo-img" />
          <h1>DLCreat</h1>
        </div>

        <nav className={`header-nav ${menuOpen ? "active" : ""}`}>
          <button className="nav-link" onClick={() => { navigate('/'); setMenuOpen(false); }}>
            Accueil
          </button>
          <button className="nav-link" onClick={() => { navigate('/'); setMenuOpen(false); }}>
            Événements
          </button>
          <button className="nav-link" onClick={() => { navigate('/create-event'); setMenuOpen(false); }}>
            Créer
          </button>
          <button className="nav-link" onClick={() => { navigate('/about'); setMenuOpen(false); }}>
            À Propos
          </button>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <div className="user-menu">
              <div className="user-greeting">
                Bienvenue, <strong>{userName}</strong>
              </div>
              <button className="btn-secondary" onClick={() => navigate('/profile')}>
                Mon Profil
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Connexion
              </button>
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                S'inscrire
              </button>
            </>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

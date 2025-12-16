import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>DLCreat</h3>
          <p>Le réseau social festif pour créer et partager vos événements inoubliables.</p>
        </div>

        <div className="footer-section">
          <h4>Liens Rapides</h4>
          <ul>
            <li><a href="/events">Événements</a></li>
            <li><a href="/about">À Propos</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Légal</h4>
          <ul>
            <li><a href="/privacy">Politique de Confidentialité</a></li>
            <li><a href="/terms">Conditions d'Utilisation</a></li>
            <li><a href="/cookies">Cookies</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} DLCreat. Tous droits réservés. | Créé avec 💜 par GreenEagle59</p>
      </div>
    </footer>
  );
}

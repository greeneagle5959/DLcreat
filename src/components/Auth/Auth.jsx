import React, { useState } from 'react';
import './Auth.css';

export default function Auth({ isLogin = true }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';

    if (!formData.password) newErrors.password = 'Mot de passe requis';
    else if (formData.password.length < 8) newErrors.password = 'Au moins 8 caractères';

    if (!isLogin) {
      if (!formData.fullName) newErrors.fullName = 'Nom complet requis';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Acceptez les conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulation API call
    setTimeout(() => {
      setLoading(false);
      alert(isLogin ? 'Connexion réussie!' : 'Inscription réussie!');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Se Connecter' : 'S\'Inscrire'}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Bienvenue sur DLCreat'
              : 'Rejoignez la communauté DLCreat'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">Nom Complet</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'input-error' : ''}
                placeholder="Jean Dupont"
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="vous@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          {isLogin && (
            <div className="form-remember">
              <a href="#forgot">Mot de passe oublié?</a>
            </div>
          )}

          {!isLogin && (
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="acceptTerms" className="checkbox-label">
                J'accepte les <a href="#terms">conditions d'utilisation</a>
              </label>
              {errors.acceptTerms && <span className="error-text">{errors.acceptTerms}</span>}
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se Connecter' : 'S\'Inscrire')}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>Pas encore de compte? <a href="/signup">S'inscrire</a></p>
          ) : (
            <p>Vous avez déjà un compte? <a href="/login">Se connecter</a></p>
          )}
        </div>
      </div>
    </div>
  );
}

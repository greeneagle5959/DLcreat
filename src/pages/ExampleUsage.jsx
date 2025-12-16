import React, { useState } from 'react';
import { useLocalStorage, useFetch, usePagination } from '@/hooks';
import { formatDate, isValidEmail } from '@/utils';
import apiService from '@/utils/api';

/**
 * Exemple d'utilisation des hooks et utilitaires
 * Ce fichier montre les patterns courants dans DLCreat
 */

export default function ExampleUsage() {
  // ===== HOOKS =====

  // useLocalStorage - Persistance des données
  const [savedEvents, setSavedEvents] = useLocalStorage('savedEvents', []);

  // useFetch - Requêtes asynchrones
  const { data: events, loading, error, fetchData } = useFetch('/events');

  // usePagination - Pagination simple
  const pagination = usePagination(events || [], 10);

  // State local
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  // ===== FONCTIONS =====

  // Validation avec utilitaire
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !isValidEmail(value)) {
      setValidationError('Email invalide');
    } else {
      setValidationError('');
    }
  };

  // Utilisation du service API
  const handleLogin = async () => {
    try {
      const response = await apiService.login(email, 'password123');
      console.log('Connecté:', response);
      setSavedEvents([...savedEvents, response]);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  // Sauvegarde dans localStorage
  const handleSaveEvent = (event) => {
    setSavedEvents([...savedEvents, event]);
  };

  // Navigation pagination
  const handleNextPage = () => {
    pagination.nextPage();
  };

  return (
    <div className="example-container">
      <h1>Exemples d'Utilisation</h1>

      {/* Exemple 1: Email Input avec Validation */}
      <section className="example-section">
        <h2>Validation d'Email</h2>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Entrez votre email"
        />
        {validationError && <p className="error">{validationError}</p>}
      </section>

      {/* Exemple 2: Requête API */}
      <section className="example-section">
        <h2>Récupération des Événements</h2>
        <button onClick={fetchData}>Charger les Événements</button>
        {loading && <p>Chargement...</p>}
        {error && <p className="error">Erreur: {error}</p>}
        {events && (
          <ul>
            {events.map((event) => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Exemple 3: Pagination */}
      <section className="example-section">
        <h2>Pagination</h2>
        <p>Page {pagination.currentPage} / {pagination.totalPages}</p>
        <ul>
          {pagination.currentItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        <button onClick={pagination.prevPage} disabled={!pagination.hasPrevPage}>
          Précédent
        </button>
        <button onClick={pagination.nextPage} disabled={!pagination.hasNextPage}>
          Suivant
        </button>
      </section>

      {/* Exemple 4: localStorage */}
      <section className="example-section">
        <h2>Événements Sauvegardés</h2>
        <p>Nombre d'événements: {savedEvents.length}</p>
        <ul>
          {savedEvents.map((event, index) => (
            <li key={index}>{event.title}</li>
          ))}
        </ul>
      </section>

      {/* Exemple 5: Formatage de Dates */}
      <section className="example-section">
        <h2>Formatage de Dates</h2>
        <p>Aujourd'hui: {formatDate(new Date())}</p>
      </section>
    </div>
  );
}

/**
 * PATTERNS COURANTS
 *
 * 1. Récupérer et afficher les événements:
 *
 *    const { data: events } = useFetch('/events');
 *    return events?.map(e => <EventCard key={e.id} {...e} />)
 *
 * 2. Sauvegarder les préférences utilisateur:
 *
 *    const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 * 3. Soumettre un formulaire:
 *
 *    const handleSubmit = async (e) => {
 *      e.preventDefault();
 *      try {
 *        const result = await apiService.createEvent(formData);
 *        alert('Succès!');
 *      } catch (err) {
 *        console.error('Erreur:', err);
 *      }
 *    }
 *
 * 4. Paginer une liste:
 *
 *    const pagination = usePagination(largeList, 20);
 *    <div>
 *      {pagination.currentItems.map(...)}
 *      <button onClick={pagination.nextPage}>Suivant</button>
 *    </div>
 */

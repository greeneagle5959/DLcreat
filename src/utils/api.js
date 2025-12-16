/**
 * Service d'API - Gère toutes les requêtes à l'API
 */

/* eslint-disable-next-line no-undef */
const API_BASE_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:3000/api';

class ApiService {
  /**
   * Effectue une requête générique
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Authentification
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Événements
  async getEvents() {
    return this.request('/events');
  }

  async getEvent(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, { method: 'DELETE' });
  }

  async joinEvent(id) {
    return this.request(`/events/${id}/join`, { method: 'POST' });
  }

  async leaveEvent(id) {
    return this.request(`/events/${id}/leave`, { method: 'POST' });
  }

  // Profil
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Commentaires
  async getComments(eventId) {
    return this.request(`/events/${eventId}/comments`);
  }

  async addComment(eventId, comment) {
    return this.request(`/events/${eventId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  // Médias
  async uploadMedia(formData) {
    return fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }
}

export default new ApiService();

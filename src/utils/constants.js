// Configuration de l'application
export const APP_CONFIG = {
  name: 'DLCreat',
  description: 'Le réseau social festif pour créer et partager vos événements inoubliables',
  version: '1.0.0',
  author: 'GreenEagle59 🦅',

  colors: {
    violet: '#7c3aed',
    violetDark: '#5b21b6',
    gray50: '#f9fafb',
    gray900: '#111827',
    gray600: '#4b5563',
    gray400: '#9ca3af',
  },

  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },

  storage: {
    prefix: 'dlcreat_',
  },
};

// Messages et textes constants
export const MESSAGES = {
  success: 'Opération réussie!',
  error: 'Une erreur est survenue',
  loading: 'Chargement...',

  auth: {
    loginSuccess: 'Connexion réussie!',
    signupSuccess: 'Inscription réussie!',
    logoutSuccess: 'Déconnexion réussie',
    invalidEmail: 'Email invalide',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
  },

  events: {
    createSuccess: 'Événement créé avec succès!',
    deleteSuccess: 'Événement supprimé',
    joinSuccess: 'Vous avez rejoint l\'événement',
    leaveSuccess: 'Vous avez quitté l\'événement',
  },
};

// Routes de l'application
export const ROUTES = {
  home: '/',
  events: '/events',
  eventDetail: '/events/:id',
  create: '/create',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
};

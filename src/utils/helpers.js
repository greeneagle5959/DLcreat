/**
 * Formate une date au format français
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formate une date et l'heure
 * @param {Date|string} date - Date à formater
 * @returns {string} Date et heure formatées
 */
export function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe (minimum 8 caractères)
 * @param {string} password - Mot de passe à valider
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return password && password.length >= 8;
}

/**
 * Récupère les initiales d'un nom
 * @param {string} name - Nom complet
 * @returns {string} Initiales
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Génère une couleur aléatoire
 * @returns {string} Couleur en hexadécimal
 */
export function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Tronque un texte avec points de suspension
 * @param {string} text - Texte à tronquer
 * @param {number} length - Longueur maximale
 * @returns {string}
 */
export function truncateText(text, length = 100) {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Clone en profondeur un objet
 * @param {*} obj - Objet à cloner
 * @returns {*} Copie profonde
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Fusionne deux objets
 * @param {object} target - Objet cible
 * @param {object} source - Objet source
 * @returns {object} Objet fusionné
 */
export function mergeObjects(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      result[key] = source[key];
    }
  }
  return result;
}

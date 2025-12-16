// On importe la connexion à la base
const pool = require('../config/database');
const path = require('path');

// Limite de taille pour les fichiers (ici 500 Mo, mais tu peux baisser si besoin)
const MAX_FILE_MB = 500;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

// ===================== MEDIAS ===================== //

// Récupérer tous les médias d'un événement
exports.getMediasByEvent = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Astuce : tu peux ajouter une pagination ici aussi !
    const [medias] = await connection.query(`
      SELECT m.id, m.url, m.type, m.created_at, u.id as user_id, u.prenom, u.nom, u.avatar
      FROM media m
      JOIN users u ON m.user_id = u.id
      WHERE m.event_id = ?
      ORDER BY m.created_at DESC
    `, [req.params.eventId]);
    connection.release();
    res.json(medias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter un média (depuis une URL, genre embed ou lien direct)
exports.addMedia = async (req, res) => {
  const { url, type, user_id, event_id } = req.body;
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO media (url, type, user_id, event_id) VALUES (?, ?, ?, ?)',
      [url, type, user_id, event_id]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, message: 'Média ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter un média via upload de fichier (image/vidéo)
exports.addMediaUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }
    // On vérifie la taille du fichier (pour éviter les abus)
    if (req.file.size > MAX_FILE_BYTES) {
      return res.status(400).json({ error: `Fichier trop volumineux (max ${MAX_FILE_MB} MB)` });
    }
    // On vérifie que l'utilisateur et l'événement sont bien précisés
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) {
      return res.status(400).json({ error: 'user_id et event_id sont requis' });
    }
    // On construit l'URL du fichier uploadé
    const fileUrl = `/uploads/${req.file.filename}`;
    // On déduit le type (image ou vidéo)
    const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO media (url, type, user_id, event_id) VALUES (?, ?, ?, ?)',
      [fileUrl, type, user_id, event_id]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, url: fileUrl, type, message: 'Média ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un média (admin ou proprio du média)
exports.deleteMedia = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// On importe la connexion à la base
const pool = require('../config/database');

// ===================== ENGAGEMENTS (likes, participations) ===================== //

// Liker un événement
exports.likeEvent = async (req, res) => {
  const { user_id, event_id } = req.body;
  try {
    const connection = await pool.getConnection();
    // On vérifie si le like existe déjà (pour éviter les doublons)
    const [existing] = await connection.query(
      'SELECT id FROM event_likes WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Déjà liké' });
    }
    await connection.query(
      'INSERT INTO event_likes (user_id, event_id) VALUES (?, ?)',
      [user_id, event_id]
    );
    connection.release();
    res.status(201).json({ message: 'Like ajouté' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enlever un like
exports.unlikeEvent = async (req, res) => {
  const { user_id, event_id } = req.params;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'DELETE FROM event_likes WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    connection.release();
    res.json({ message: 'Like retiré' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Participer à un événement
exports.joinEvent = async (req, res) => {
  const { user_id, event_id } = req.body;
  try {
    const connection = await pool.getConnection();
    // On vérifie si l'utilisateur participe déjà
    const [existing] = await connection.query(
      'SELECT id FROM event_participants WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Déjà participant' });
    }
    await connection.query(
      'INSERT INTO event_participants (user_id, event_id) VALUES (?, ?)',
      [user_id, event_id]
    );
    connection.release();
    res.status(201).json({ message: 'Participation confirmée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Quitter un événement
exports.leaveEvent = async (req, res) => {
  const { user_id, event_id } = req.params;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'DELETE FROM event_participants WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    connection.release();
    res.json({ message: 'Participation retirée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Savoir si un user a liké/participe à un event (pour afficher le bouton "like" ou "participer")
exports.getEngagementStatus = async (req, res) => {
  const { user_id, event_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [liked] = await connection.query(
      'SELECT id FROM event_likes WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    const [participating] = await connection.query(
      'SELECT id FROM event_participants WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    connection.release();
    res.json({
      liked: liked.length > 0,
      participating: participating.length > 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

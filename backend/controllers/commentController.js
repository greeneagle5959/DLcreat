// On importe la connexion à la base
const pool = require('../config/database');

// ===================== COMMENTAIRES ===================== //

// Récupérer les commentaires d'un événement
exports.getCommentsByEvent = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Astuce : tu peux ajouter une pagination ici aussi !
    const [comments] = await connection.query(`
      SELECT c.id, c.contenu, c.created_at, u.id as user_id, u.prenom, u.nom, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.event_id = ?
      ORDER BY c.created_at DESC
    `, [req.params.eventId]);
    connection.release();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un commentaire
exports.createComment = async (req, res) => {
  const { contenu, user_id, event_id } = req.body;
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO comments (contenu, user_id, event_id) VALUES (?, ?, ?)',
      [contenu, user_id, event_id]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, message: 'Commentaire créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un commentaire (admin ou proprio du commentaire)
exports.deleteComment = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les commentaires (pour l'admin)
exports.getAllComments = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [comments] = await connection.query(`
      SELECT c.id, c.contenu, c.created_at,
      u.id as user_id, u.prenom, u.nom,
      e.id as event_id, e.titre
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN events e ON c.event_id = e.id
      ORDER BY c.created_at DESC
    `);
    connection.release();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

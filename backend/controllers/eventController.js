// On importe la connexion à la base
const pool = require('../config/database');

// ===================== EVENEMENTS ===================== //

// Récupérer tous les événements (avec infos créateur, nb participants, nb likes)
exports.getAllEvents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Ici on récupère tout d'un coup, mais pour booster :
    // - Ajoute une pagination (LIMIT/OFFSET)
    // - Trie par date ou popularité
    const [events] = await connection.query(`
      SELECT e.*, u.prenom, u.nom, u.avatar,
      COUNT(DISTINCT ep.user_id) as nb_participants,
      COUNT(DISTINCT el.user_id) as nb_likes
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN event_likes el ON e.id = el.event_id
      GROUP BY e.id
      ORDER BY e.date_debut DESC
    `);
    connection.release();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un événement précis (avec détails)
exports.getEventById = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [events] = await connection.query(`
      SELECT e.*, u.prenom, u.nom, u.avatar,
      COUNT(DISTINCT ep.user_id) as nb_participants,
      COUNT(DISTINCT el.user_id) as nb_likes
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN event_likes el ON e.id = el.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `, [req.params.id]);
    connection.release();
    if (events.length === 0) return res.status(404).json({ error: 'Événement non trouvé' });
    res.json(events[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les événements créés par un utilisateur
exports.getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const connection = await pool.getConnection();
    const [events] = await connection.query(`
      SELECT e.*, u.prenom, u.nom, u.avatar,
      COUNT(DISTINCT ep.user_id) as nb_participants,
      COUNT(DISTINCT el.user_id) as nb_likes
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN event_likes el ON e.id = el.event_id
      WHERE e.user_id = ?
      GROUP BY e.id
      ORDER BY e.date_debut DESC
    `, [userId]);
    connection.release();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les événements où l'utilisateur participe
exports.getEventsParticipating = async (req, res) => {
  try {
    const userId = req.params.userId;
    const connection = await pool.getConnection();
    const [events] = await connection.query(`
      SELECT e.*, u.prenom, u.nom, u.avatar,
      COUNT(DISTINCT ep.user_id) as nb_participants,
      COUNT(DISTINCT el.user_id) as nb_likes
      FROM event_participants p
      JOIN events e ON p.event_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN event_likes el ON e.id = el.event_id
      WHERE p.user_id = ?
      GROUP BY e.id
      ORDER BY e.date_debut DESC
    `, [userId]);
    connection.release();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les événements likés par l'utilisateur
exports.getEventsLiked = async (req, res) => {
  try {
    const userId = req.params.userId;
    const connection = await pool.getConnection();
    const [events] = await connection.query(`
      SELECT e.*, u.prenom, u.nom, u.avatar,
      COUNT(DISTINCT ep.user_id) as nb_participants,
      COUNT(DISTINCT el.user_id) as nb_likes
      FROM event_likes l
      JOIN events e ON l.event_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN event_likes el ON e.id = el.event_id
      WHERE l.user_id = ?
      GROUP BY e.id
      ORDER BY e.date_debut DESC
    `, [userId]);
    connection.release();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un événement (faut valider les champs côté front ET back !)
exports.createEvent = async (req, res) => {
  const { titre, description, date_debut, date_fin, lieu, user_id } = req.body;
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO events (titre, description, date_debut, date_fin, lieu, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [titre, description, date_debut, date_fin, lieu, user_id]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, message: 'Événement créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un événement
exports.updateEvent = async (req, res) => {
  const { titre, description, date_debut, date_fin, lieu } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE events SET titre=?, description=?, date_debut=?, date_fin=?, lieu=? WHERE id=?',
      [titre, description, date_debut, date_fin, lieu, req.params.id]
    );
    connection.release();
    res.json({ message: 'Événement modifié avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

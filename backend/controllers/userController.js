import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token invalide' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Token manquant' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, prenom, nom, email, bio, avatar, created_at FROM users');
    connection.release();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [user] = await connection.query('SELECT id, prenom, nom, email, bio, avatar, created_at FROM users WHERE id = ?', [req.params.id]);
    connection.release();
    if (user.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserSummary = async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = await pool.getConnection();
    const [[{ total_events }]] = await connection.query('SELECT COUNT(*) AS total_events FROM events WHERE user_id = ?', [userId]);
    const [[{ total_participations }]] = await connection.query('SELECT COUNT(*) AS total_participations FROM event_participants WHERE user_id = ?', [userId]);
    const [[{ total_likes }]] = await connection.query('SELECT COUNT(*) AS total_likes FROM event_likes WHERE user_id = ?', [userId]);
    const [[{ total_comments }]] = await connection.query('SELECT COUNT(*) AS total_comments FROM comments WHERE user_id = ?', [userId]);
    connection.release();
    res.json({
      events: total_events || 0,
      participations: total_participations || 0,
      likes: total_likes || 0,
      comments: total_comments || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { prenom, nom, email, password } = req.body;
  if (!prenom || !nom || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO users (prenom, nom, email, password) VALUES (?, ?, ?, ?)', [prenom, nom, email, hashedPassword]);
    connection.release();
    res.status(201).json({
      user: {
        id: result.insertId,
        prenom,
        nom,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();
    if (users.length === 0) return res.status(401).json({ error: 'Utilisateur non trouvé' });
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ message: 'Connexion réussie', token, user: { id: user.id, prenom: user.prenom, nom: user.nom, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { prenom, nom, email, bio, avatar } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET prenom=?, nom=?, email=?, bio=?, avatar=? WHERE id=?',
      [prenom, nom, email, bio, avatar, req.params.id]);
    connection.release();
    res.json({ message: 'Utilisateur modifié avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    const { id } = req.params;
    const avatarUrl = `/uploads/${req.file.filename}`;

    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET avatar=? WHERE id=?', [avatarUrl, id]);
    connection.release();

    res.json({ avatar: avatarUrl, message: 'Avatar mis à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followUser = async (req, res) => {
  const { follower_id, followee_id } = req.body;
  if (!follower_id || !followee_id) {
    return res.status(400).json({ error: 'follower_id et followee_id requis' });
  }
  if (Number(follower_id) === Number(followee_id)) {
    return res.status(400).json({ error: 'Impossible de se suivre soi-même' });
  }
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT IGNORE INTO friends (follower_id, followee_id) VALUES (?, ?)',
      [follower_id, followee_id]
    );
    connection.release();
    res.json({ message: 'Abonnement effectué' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { follower_id, followee_id } = req.body;
  if (!follower_id || !followee_id) {
    return res.status(400).json({ error: 'follower_id et followee_id requis' });
  }
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'DELETE FROM friends WHERE follower_id = ? AND followee_id = ?',
      [follower_id, followee_id]
    );
    connection.release();
    res.json({ message: 'Désabonnement effectué' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT u.id, u.prenom, u.nom, u.email, u.avatar
       FROM friends f
       JOIN users u ON f.follower_id = u.id
       WHERE f.followee_id = ?`,
      [userId]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT u.id, u.prenom, u.nom, u.email, u.avatar
       FROM friends f
       JOIN users u ON f.followee_id = u.id
       WHERE f.follower_id = ?`,
      [userId]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMutualFriends = async (req, res) => {
  try {
    const { id, otherId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT u.id, u.prenom, u.nom, u.email, u.avatar
       FROM friends f1
       JOIN friends f2 ON f1.followee_id = f2.followee_id
       JOIN users u ON u.id = f1.followee_id
       WHERE f1.follower_id = ? AND f2.follower_id = ?`,
      [id, otherId]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminOverview = async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    const [[{ users }]] = await connection.query('SELECT COUNT(*) AS users FROM users');
    const [[{ events }]] = await connection.query('SELECT COUNT(*) AS events FROM events');
    const [[{ comments }]] = await connection.query('SELECT COUNT(*) AS comments FROM comments');
    const [[{ likes }]] = await connection.query('SELECT COUNT(*) AS likes FROM event_likes');
    const [[{ medias }]] = await connection.query('SELECT COUNT(*) AS medias FROM media');
    connection.release();
    res.json({ users, events, comments, likes, medias });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===================== SERVEUR PRINCIPAL ===================== //
// On importe les modules nécessaires
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// On charge les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Pour avoir __dirname en ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ===================== MIDDLEWARES ===================== //
app.use(helmet()); // Sécurité des headers HTTP
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===================== UPLOADS ===================== //
// Dossier uploads (media + avatars)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ===================== ROUTES ===================== //
import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import commentsRouter from './routes/comments.js';
import engagementRouter from './routes/engagement.js';

app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/engagement', engagementRouter);

// Route test pour vérifier que le backend tourne
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running!' });
});

// ===================== GESTION DES ERREURS ===================== //
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// ===================== LANCEMENT DU SERVEUR ===================== //
app.listen(PORT, () => {
  console.log(`✅ Serveur Express démarré sur http://localhost:${PORT}`);
  console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
});

export default app;

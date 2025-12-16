// Routeur pour les likes, participations et médias
import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import * as engagementController from '../controllers/engagementController.js';
import * as mediaController from '../controllers/mediaController.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
	destination: (_, __, cb) => cb(null, uploadsDir),
	filename: (_, file, cb) => {
		const timestamp = Date.now();
		const safeName = file.originalname.replace(/\s+/g, '_');
		cb(null, `${timestamp}_${safeName}`);
	}
});
const upload = multer({
	storage,
	limits: { fileSize: 500 * 1024 * 1024 },
	fileFilter: (_, file, cb) => {
		if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
			cb(null, true);
		} else {
			cb(new Error('Type de fichier non supporté'));
		}
	}
});

// Likes
router.post('/like', engagementController.likeEvent);
router.delete('/like/:user_id/:event_id', engagementController.unlikeEvent);
// Participants
router.post('/join', engagementController.joinEvent);
router.delete('/join/:user_id/:event_id', engagementController.leaveEvent);
// Statut
router.get('/:user_id/:event_id', engagementController.getEngagementStatus);
// Médias
router.get('/media/event/:eventId', mediaController.getMediasByEvent);
router.post('/media/upload', upload.single('file'), mediaController.addMediaUpload);
router.post('/media', mediaController.addMedia);
router.delete('/media/:id', mediaController.deleteMedia);

export default router;

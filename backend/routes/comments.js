// Routeur pour les commentaires
import express from 'express';
import * as commentController from '../controllers/commentController.js';
const router = express.Router();

router.get('/event/:eventId', commentController.getCommentsByEvent);
router.get('/', commentController.getAllComments);
router.post('/', commentController.createComment);
router.delete('/:id', commentController.deleteComment);

export default router;

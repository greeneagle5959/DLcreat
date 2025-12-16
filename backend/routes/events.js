// Routeur pour les événements
import express from 'express';
import * as eventController from '../controllers/eventController.js';
const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/user/:userId', eventController.getEventsByUser);
router.get('/participating/:userId', eventController.getEventsParticipating);
router.get('/liked/:userId', eventController.getEventsLiked);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;

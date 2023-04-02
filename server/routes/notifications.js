import express   from 'express';
import {authApp} from '../middlewares/auth.js'
import {
	getNotifications, createNotification,
	getNotification, editNotification, deleteNotification
}                from '../controllers/notifications.js';

// /api/notifications
let router = express.Router();

// GET /api/notifications
router.get('/', authApp, getNotifications)
// POST /api/notifications
router.post('/', authApp, createNotification)

// router.get('/:id', authApp, getNotification)
// router.put('/:id', authApp, editNotification)
// router.delete('/:id', authApp, deleteNotification)


export default router;
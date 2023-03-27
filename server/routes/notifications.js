import express   from 'express';
import {authApp} from '../middlewares/auth.js'
import {
	getNotifications, createNotification,
	getNotification, editNotification, deleteNotification
}                from '../controllers/notifications.js';

let router = express.Router();

router.get('/', authApp, getNotifications)
router.post('/', authApp, createNotification)

// router.get('/:id', authApp, getNotification)
// router.put('/:id', authApp, editNotification)
// router.delete('/:id', authApp, deleteNotification)


export default router;
import express           from 'express';
import {authApp} from "../middlewares/auth.js";
import {subscribe, unsubscribe}         from "../controllers/subscription.js";

// /api/subscription
let router = express.Router();

// POST /api/subscription
router.post('', authApp, subscribe)
router.post('/', authApp, subscribe)

// DELETE /api/subscription
router.delete('', authApp, unsubscribe)
router.delete('/', authApp, unsubscribe)

export default router;
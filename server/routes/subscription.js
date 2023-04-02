import express           from 'express';
import {authApp} from "../middlewares/auth.js";
import {subscribe}         from "../controllers/subscription.js";

// /api/subscription
let router = express.Router();

// POST /api/subscription
router.post('', authApp, subscribe)
router.post('/', authApp, subscribe)

export default router;
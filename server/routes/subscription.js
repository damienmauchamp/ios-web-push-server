import express           from 'express';
import {authApp} from "../middlewares/auth.js";
import {subscribe}         from "../controllers/subscription.js";
let router = express.Router();

router.post('', authApp, subscribe)
router.post('/', authApp, subscribe)

export default router;
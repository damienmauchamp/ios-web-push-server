import express        from "express";
import {authApp}      from "../middlewares/auth.js";
import {schedulePush} from "../controllers/push.js";
import {subscribe}    from "../controllers/subscription.js";

// /api/push
let router = express.Router();

// POST /api/push
router.post('', authApp, schedulePush)
router.post('/', authApp, schedulePush)

export default router;
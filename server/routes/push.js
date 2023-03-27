import express        from "express";
import {authApp}      from "../middlewares/auth.js";
import {schedulePush} from "../controllers/push.js";

let router = express.Router();

router.post('/', authApp, schedulePush)

export default router;
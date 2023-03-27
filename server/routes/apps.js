import express                      from 'express';
import {getApps, createApp, getApp} from '../controllers/apps.js';
import {authApp, authMaster, authAppOrMaster}                 from '../middlewares/auth.js'

let router = express.Router();

router.get('/', authAppOrMaster, getApps)
router.post('/', authMaster, createApp)

router.get('/:id', authAppOrMaster, getApp)
// router.get('/:id', authMasterOrUser, getApp)
// todo : router.put('/:id', authMasterOrUser, editApp)
// todo : router.delete('/:id', authMaster, createApp)


// //Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
// 	console.log('Time: ', Date.now());
// 	next();
// });
//
//
// // Define the home page route
// router.get('/', function(req, res) {
// 	res.send('home page');
// });

export default router;
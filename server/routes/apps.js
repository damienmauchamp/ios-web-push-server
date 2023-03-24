import express from 'express';
let router = express.Router();

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
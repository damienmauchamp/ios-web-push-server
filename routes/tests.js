import express from "express";
let router = express.Router();

// let subscriptionData = null;
// router.get('/send-notification', (req, res) => {
// 	console.log('Sending')
// 	if (subscriptionData) {
// 		console.log('subscriptionData', subscriptionData)
//
//
// 		let message = JSON.stringify({
// 			title: 'Notifications',
// 			body: 'Hello world of strings!',
// 		});
// 		// message = 'Hello world!';
//
// 		webpush.sendNotification(subscriptionData, message).then(result => console.log(result)).catch(err => console.log(err))
// 	} else {
// 		console.log('No subscription')
// 	}
// 	res.sendStatus(200);
// })
//
// router.post("/save-subscription", async (req, res) => {
// 	console.log('Subscription')
// 	subscriptionData = req.body;
// 	res.sendStatus(200);
// });

export default router;
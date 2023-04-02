// import AppNotifications from "../models/appNotifications.js";
import AppNotifications from "../models/appNotifications.js";
import subscriptions    from "../models/subscriptions.js";
import webpush          from "web-push";


let push = (notification, title, body, subscription) => {
	let message = JSON.stringify({
		title: title || notification.default.title,
		body: body || notification.default.body,
	});
	return webpush.sendNotification(subscription, message);
}

export function schedulePush(req, res, next) {

	let application = res.locals.application;
	let title = req.body.title;
	let body = req.body.body;
	let notificationId = req.body.notificationId;
	let subscription = req.body.subscription;
	// let timestamp = req.body.timestamp; // todo : futur

	//
	new Promise((resolve, reject) => {
		AppNotifications.findById(notificationId)
			.populate('subscriptions')
			.then(notification => {
				if (!notification) {
					reject(`Can't find notification with ID ${notificationId}`);
					return false;
				}

				console.log('[schedulePush] notification found:', notification)
				return resolve(notification);
			})
	}).then(notification => {

		// todo : data replacement (ex: {{artist}}, ...)

		if (subscription) {
			// personal
			console.log('[schedulePush] Personal subscription :', subscription)

			push(notification, title, body, subscription).then(result => {
				console.log('[schedulePush] Send !', result)
			}).catch(error => {
				console.log('[schedulePush] Error while sending !', error)
				// res.status(400).json({
				// 	message:'Error while sending',
				// 	error:error,
				// });
				throw new Error('Error while sending');
			})
		} else {
			// global
			let results = [];
			notification.subscriptions.forEach(subscription => {
				console.log('[schedulePush] Go for subscription :', subscription)

				push(notification, title, body, subscription).then(result => {
					console.log('[schedulePush] Sent !', result)
					results.push({
						subscription: subscription._id,
						result: result,
						error: false,
						message: 'Sent',
					})
				}).catch(error => {
					results.push({
						subscription: subscription._id,
						result: false,
						error: true,
						message: error,
					})
				})
			})

			res.status(200).json({
				results: results,
				errors: results.filter(r => r.error),
			})
		}

	}).catch(err => {
		console.error('Error while scheduling:', err)
		res.status(400).json({err})
	})


	// AppNotifications.findById(req.body.appNotificationId)
	// 	.populate('subscriptions')
	// 	.then(notification => {
	// 		// todo : parcourir notification.subscriptions pour les ajouter à scheduledNotifications (si non présent)
	// 		// todo : exécuter "envoyer"
	// 	})
	// // AppNotifications.findById(req.body.appNotificationId)
	// // req.body.appNotificationId;

}
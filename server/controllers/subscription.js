// import AppNotifications from "../models/appNotifications.js";
import AppNotifications from "../models/appNotifications.js";
import Subscription     from "../models/subscriptions.js";

export function subscribe(req, res, next) {

	let application = res.locals.application;
	let subscriptionData = req.body.subscription;
	let notificationId = req.body.notification || ''; // or global ?

	console.log('subscribe', {
		application: application,
		subscriptionData: subscriptionData,
		notificationId: notificationId,
		body: req.body,
	})

	new Promise((resolve, reject) => {
		if (notificationId) {
			// checking notificationId
			AppNotifications.findById(notificationId).then(notification => {
				if (!notification) {
					reject(`Can't find notification with ID ${notificationId}`);
					return false;
				}
				return resolve(notification);
			})
		} else {
			AppNotifications.findOne({type: 'global'}).then(notification => {
				if (!notification) {
					reject(`Can't find global notification`);
					return false;
				}
				return resolve(notification);
			})
		}
	}).then(notification => {
		console.log('[subscribe] Notification found:', notification);

		// // recherche une subscription similaire
		Subscription.find({
			app: application,
			notification: notification,
			keys: subscriptionData.keys,
		}).then(subscription => {
			if (subscription.length) {
				console.log('[subscribe] Already subscribed', subscription)

				res.status(304).json({
					message: 'Already subscribed',
					subscription: subscription,
					params: {
						app: application,
						keys: subscriptionData.keys,
					}
				})
				next();

			} else {

				/**
				 * @todo Une subscriptionData doit être rattachée à une app (OK)
				 * @todo Ajouter un type "général" lorsqu'il n'y a pas de notif, par défaut toujours en créer un pour les notifs par défaut ?
				 * @todo Une subscriptionData doit être rattachée à plusieurs notifications (notifications: [])
				 */

				// Creating
				let subscription = new Subscription({
					app: application,
					notification: notification,
					endpoint: subscriptionData.endpoint,
					expirationTime: subscriptionData.expirationTime,
					keys: subscriptionData.keys,
				})
				console.log('[subscribe] New subscription:', subscription)

				subscription.save().then(subscription => {
					console.log('[subscribe] New subscription saved:', subscription)

					notification.subscriptions.push(subscription)
					notification.save().then(notification => {
						res.status(201).json({
							application: application,
							subscription: subscription,
						})
						next();
					}).catch(err => {
						console.error(err);
						throw new Error('[subscribe] Can\'t save subscription to notification');
					});

				})
			}
		})
	}).catch(err => {
		console.error('Error while subscribing:', err)
		res.status(400).json({err})
	})
}
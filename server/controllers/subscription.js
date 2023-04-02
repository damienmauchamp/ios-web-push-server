// import AppNotifications from "../models/appNotifications.js";
import AppNotifications from "../models/appNotifications.js";
import Subscription     from "../models/subscriptions.js";

export function subscribe(req, res) {

	let application = res.locals.application;
	let subscriptionData = req.body.subscription;
	let notificationId = req.body.notification || ''; // or global ?

	console.log('[subscribe]', {
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
				// next();
				// return true;
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
					// res.status(201).json({
					// 	application: application,
					// 	subscription: subscription,
					// })
					// next();
					notification.save().then(notification => {
						console.log('[subscribe] Notification saved:', notification)
						res.status(201).json({
							id: notification._id,
							subscription: subscription._id,
						})
						// 	next();
					}).catch(err => {
						console.error('[subscribe] err:', err);
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

export function unsubscribe(req, res) {

	let application = res.locals.application;
	let subscriptionData = req.body.subscription;
	let notificationId = req.body.notificationId || ''; // or global ?

	console.log('[unsubscribe]', {
		application: application,
		subscriptionData: subscriptionData,
		notificationId: notificationId,
		body: req.body,
	})

	new Promise((resolve, reject) => {

		if (!notificationId) {
			console.log('[unsubscribe] No notification ID');
			reject(`No notification ID`);
			return false;
		}

		AppNotifications.findById(notificationId).then(notification => {
			if (!notification) {
				reject(`Can't find global notification`);
				return false;
			}
			return resolve(notification);
		})
	}).then(notification => {
		console.log('[unsubscribe] Notification found:', notification);
		Subscription.findOne({
			app: application,
			notification: notification,
			keys: subscriptionData.keys,
		}).then(subscription => {
			if (!subscription) {
				// Not subscribed
				console.log('[unsubscribe] Not subscribed');
				res.status(304).json({
					message: 'Not subscribed'
				})
			} else {

				let subscriptionId = subscription._id;
				// subscription.remove().then(err => {
				Subscription.findByIdAndDelete(subscriptionId).then(err => {
					console.log('[unsubscribe] findByIdAndDelete err:', err)

					AppNotifications.updateOne({_id: notificationId}, {
						$pullAll: {
							subscriptions: [{
								_id: subscriptionId
							}]
						}
					}).then(updateOneRes => {
						console.log('[unsubscribe] updateOneRes:', updateOneRes)
					})

					console.log('[unsubscribe] Successfully unsubscribed')
					res.status(200).json({
						message: 'Successfully unsubscribed'
					})

				})
			}

		})

	}).catch(err => {
		console.error('Error while subscribing:', err)
		res.status(400).json({err})
	})
}
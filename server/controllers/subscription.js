// import AppNotifications from "../models/appNotifications.js";
import AppNotifications from "../models/appNotifications.js";
import Subscription from "../models/subscriptions.js";
export function subscribe(req, res, next) {

	let application = res.locals.application;
	let subscriptionData = req.body.subscription;

	// todo : ID notif

	console.log('subscribe', {
		application: application,
		subscriptionData: subscriptionData,
		body: req.body,
	})

	// recherche une subscription similaire
	Subscription.find({
		app: application,
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
		} else {

			// Creating
			let subscription = new Subscription({
				app: application,
				endpoint: subscriptionData.endpoint,
				expirationTime: subscriptionData.expirationTime,
				keys: subscriptionData.keys,
			})
			console.log('[subscribe] New subscription:', subscription)

			subscription.save().then(subscription => {
				console.log('[subscribe] New subscription saved:', subscription)
				res.status(201).json({
					application: application,
					subscription: subscription,
				})
			}).catch(err => res.status(400).json({err}))
		}
	}).catch(err => res.status(400).json({err}))
}
// import AppNotifications from "../models/appNotifications.js";
import AppNotifications from "../models/appNotifications.js";
import Subscription from "../models/subscriptions.js";
export function subscribe(req, res, next) {

	let application = res.locals.application;
	let subscriptionData = req.body.subscription;

	// recherche une subscription similaire
	Subscription.find({
		app: application,
		keys: subscriptionData.keys,
	}).then(subscription => {
		if (subscription) {
			res.status(304).json({message: 'Already subscribed'})
		} else {

			// Creating
			let subscription = new Subscription({
				app: application,
				endpoint: subscriptionData.endpoint,
				expirationTime: subscriptionData.expirationTime,
				keys: subscriptionData.keys,
			})

			subscription.save().then(subscription => {
				res.status(201).json({subscription})
			}).catch(err => res.status(400).json({err}))
		}
	}).catch(err => res.status(400).json({err}))
}
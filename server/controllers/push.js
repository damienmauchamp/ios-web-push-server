// import AppNotifications from "../models/appNotifications.js";
import AppNotifications from "../models/appNotifications.js";
export function schedulePush(req, res, next) {

	AppNotifications.findById(req.body.appNotificationId)
		.populate('subscriptions')
		.then(notification => {
			// todo : parcourir notification.subscriptions pour les ajouter à scheduledNotifications (si non présent)
			// todo : exécuter "envoyer"
		})
	// AppNotifications.findById(req.body.appNotificationId)
	// req.body.appNotificationId;

}
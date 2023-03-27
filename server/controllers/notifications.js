import Application     from "../models/apps.js";
import AppNotification from "../models/notifications.js";

export function getNotifications(req, res, next) {
	let application = res.locals.application;

	AppNotification.find({app: application})
		.populate('app')
		.populate('parent')
		.populate('children')
		.then(notifications => {
			res.status(200).json(notifications)
		}).catch(err => res.status(400).json({err}))
}

export async function createNotification(req, res, next) {
	let application = res.locals.application;

	//
	const notification = new AppNotification({
		app: application,
		parent: null,
		name: req.body.name,
		description: req.body.description || '',
		default: {
			title: req.body.default.title,
			body: req.body.default.body,
		},
		disabled: false,
	});

	//
	if (!notification.name) res.status(400).json({error: 'Please enter a name'})

	// parent
	if (req.body.parentId) {
		console.log('req.body.parentId', req.body.parentId)
		await AppNotification.findById(req.body.parentId).then(parent => {
			// if (!parent) {
			// 	return res.sendStatus(400).json({
			// 		error: "Can't find parent",
			// 	})
			// }
			if (parent) {
				notification.parent = parent;
			}
		})
	}

	notification.save().then(notification => {

		// application
		application.notifications.push(notification._id);
		application.save()

		// notification.parent
		if (notification.parent) {
			notification.parent.children.push(notification._id)
			notification.parent.save()
		}

		res.status(200).json(notification)
		next();
	}).catch(err => res.status(400).json({err}))

}

export function getNotification(req, res, next) {
	res.status(200).json({res: '[getNotification] not implemented'})
}

export function editNotification(req, res, next) {
	res.status(200).json({res: '[editNotification] not implemented'})
}

export function deleteNotification(req, res, next) {
	res.status(200).json({res: '[deleteNotification] not implemented'})
}
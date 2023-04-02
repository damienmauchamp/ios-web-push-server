import Application     from "../models/applications.js";
import AppNotification from "../models/appNotifications.js";

export function getNotifications(req, res, next) {
	let application = res.locals.application;

	AppNotification.find({app: application})
		.populate('app')
		// .populate('parent')
		// .populate('children')
		.then(notifications => {
			res.status(200).json(notifications)
		}).catch(err => res.status(400).json({err}))
}

export function newNotification(application, data) {

	// todo : App global notification creation failed Error: AppNotification validation failed: default.body: Path `default.body` is required., default.title: Path `default.title` is required.
	const notification = new AppNotification({
		app: application,
		parent: data.parent,
		name: data.name,
		type: data.type || 'global',
		description: data.description || '',
		default: {
			title: data.default.title,
			body: data.default.body,
		},
		disabled: false,
	});

	return new Promise(async (resolve, reject) => {

		if (!notification.name) {
			reject('Please enter a name');
			return false;
		}

		// On recherche le type général, s'il n'y en a pas et que l'app n'en a pas, on
		let messageType = notification.type === 'global' ? 'Global' : `"${notification.type}"`
		let globalNotification = await AppNotification.findOne({
			app: notification.app,
			type: notification.type,
		}).then(globalNotification => {
			console.log('globalNotification', globalNotification)
			return globalNotification;
		}).catch(err => {
			console.log(`${messageType} notification ERR`, err)
			return false;
		})

		if (globalNotification) {
			reject(`${messageType} notification already exists`);
			return false;
		}

		// Gestion du parentId
		if (data.parentId) {
			// On recherche la notification parent
			console.log('data.parentId', data.parentId)
			await AppNotification.findById(data.parentId).then(parent => {
				if (!parent) {
					reject('Can\'t find parent');
					return false;
				}

				if (parent) {
					notification.parent = parent;
				}
			})
		}

		// On crée l'application
		notification.save().then(notification => {

			// application
			application.notifications.push(notification._id);
			application.save()

			// notification.parent
			if (notification.parent) {
				notification.parent.children.push(notification._id)
				notification.parent.save()
			}

			resolve(notification);
			return notification;
		}).catch(err => reject(err))
	})

}

export async function createNotification(req, res, next) {
	let application = res.locals.application;

	newNotification(application, {
		app: application,
		parent: null,
		name: req.body.name,
		type: req.body.type,
		description: req.body.description || '',
		default: {
			title: req.body.default.title,
			body: req.body.default.body,
		},
		disabled: false,
		//
		parentId: req.body.parentId,
	}).then(notification => {
		res.status(200).json(notification)
		next();
	}).catch(err => res.status(400).json({error: err}));
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
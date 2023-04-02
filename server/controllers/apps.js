import jwt               from 'jsonwebtoken'
import Application       from "../models/applications.js";
import AppNotification   from "../models/appNotifications.js";
import {newNotification} from './notifications.js';

import {getUserToken, userIsMaster} from '../middlewares/auth.js'

// let isMaster = (req) => {
// 	const token = getToken(req);
// 	return isMaster(token);
// }

export function getApps(req, res) {

	let filters = {};
	if (!userIsMaster(req)) {
		filters.token = getUserToken(req);
	}

	Application.find(filters)
		.populate('notifications')
		.then(apps => {
			res.status(200).json({apps})
		}).catch(err => {
		res.status(400).json({err})
	})
	// res.status(200).json({res: '[getApps] not implemented'})
}

export function createApp(req, res, next) {

	Application.findOne({name: req.body.name}).exec().then(r => {
		if (r !== null) {
			return res.status(400).json({
				error: 'Name already used'
			})
		}

		//
		const application = new Application({
			name: req.body.name,
			token: 'TMP',
			disabled: false,
		});

		application.save().then(application => {

			console.log('Object app created', application, application.id)

			// creating token
			application.token = jwt.sign(application.id, process.env.TOKEN_SECRET, {});
			console.log('Generated token', application.token)

			// creating first global notification
			// token is saved in the creation of the notification
			newNotification(application, {
				app: application,
				parent: null,
				parentId: null,
				name: 'Global',
				type: 'global',
				description: 'Global notification',
				default: {
					title: 'Default',
					body: 'This is a notification',
				},
				disabled: false,
			}).then(notification => {
				console.log('Application created', application)
				console.log('Notification created', notification)

				res.status(201).json({
					message: `App "${application.name}" created.`,
					application: application,
				});
				next();
			}).catch(err => {
				console.error('App global notification creation failed', err)
				application.remove();
				throw new Error(err)
			})
		}).catch(err => {
			res.status(400).json({err});
		})
	}).catch(err => res.status(400).json({err}))
}

export function getApp(req, res) {
	let filters = {_id: req.params.id};
	if (!userIsMaster(req)) {
		filters.token = getUserToken(req);
	}

	Application.findOne(filters)
		.populate('notifications')
		.then(app => {
			AppNotification.find({app: app})
				.populate('parent')
				.populate('children')
				.then(notifications => {
					console.log('[getApp] notifications', notifications)
					app.notifications = notifications
					console.log('[getApp] app', app)
					res.status(200).json({app})
				})

			//

		}).catch(err => {
		console.log(err)
		res.status(400)
	})
	// res.status(200).json({res: '[getApps] not implemented'})
}
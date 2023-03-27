import jwt             from 'jsonwebtoken'
import Application     from "../models/applications.js";
import AppNotification from "../models/appNotifications.js";

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

export function createApp(req, res) {

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

			application.save().then(application => {

				console.log('App created', application)

				return res.status(201).json({
					message: `App "${application.name}" created.`
				});
			}).catch(err => {
				application.remove();
				return res.status(400).json({err})
			})
			console.log('application', application)

		}).catch(err => res.status(400).json({err}))
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
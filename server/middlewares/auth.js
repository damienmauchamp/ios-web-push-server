import '../env.mjs';
import jwt         from 'jsonwebtoken';
import Application from "../models/applications.js";

let getToken = (req) => {
	const authHeader = req.headers.authorization
	return authHeader && authHeader.split(' ')[1]
}

let isMaster = (token) => {

	// no token
	if (!token) {
		console.log('[isMaster] token', token)
		console.log('[isMaster] process.env.TOKEN_SECRET', process.env.TOKEN_SECRET)
		return {
			status: 401,
			error: true,
			message: 'No token found',
		};
	}

	if (token !== process.env.TOKEN_SECRET) {
		return {
			status: 403,
			error: true,
			message: 'Unauthorized',
		};
	}
	return {
		status: 200,
		error: false,
		message: '',
	};
}

let isApp = (token) => {

	// no token
	if (!token) {
		console.log('[isApp] token', token)
		return {
			status: 401,
			error: true,
			message: 'No token found',
		};
	}

	return jwt.verify(token, process.env.TOKEN_SECRET, async (err, id) => {

		//
		if (err) {
			return {
				status: 403,
				error: true,
				message: err,
			};
		}

		let ret = {}
		await Application.findById(id).then(application => {

			console.log('application', application)
			if (!application) {
				ret = {
					status: 403,
					error: true,
					message: 'Token not valid',
				};
			}

			ret = {
				status: 200,
				application: application,
				error: false,
				message: '',
			};
		})
		return ret
	})
}

export function authMaster(req, res, next) {
	try {

		const token = getToken(req);
		const master = isMaster(token);

		if (master.error) {
			return res.status(master.status || 400).json({
				message: master.message || 'Error',
			});
		}

		next();
	} catch (e) {
		return res.sendStatus(401);
	}
}

export function authApp(req, res, next) {
	try {

		const token = getToken(req);
		isApp(token).then(app => {

			if (app.error) {
				return res.status(app.status || 400).json({
					message: app.message || 'Error',
				});
			}

			res.locals.application = app.application
			next();
		}).catch(err => res.status(401).json({err}))
	} catch (e) {
		return res.sendStatus(401);
	}
	// try {
	//
	// 	const token = getToken(req);
	// 	const app = isApp(token);
	//
	//
	// 	console.log('[authApp] token:', token)
	//
	// 	// no token
	// 	if (!token) {
	// 		return res.sendStatus(401);
	// 	}
	//
	// 	jwt.verify(token, process.env.TOKEN_SECRET, (err, id) => {
	//
	// 		//
	// 		if (err) return res.sendStatus(403)
	//
	// 		console.log('verify.id:', id)
	//
	// 		// find user
	// 		Application.findById(id).then(application => {
	//
	// 			if (!application) return res.sendStatus(403)
	// 			res.locals.application = application;
	// 			console.log('application:', application)
	// 			next();
	// 		})
	//
	// 		console.log('res')
	// 	})
	//
	// } catch (e) {
	// 	return res.sendStatus(401);
	// }
}

export function authAppOrMaster(req, res, next) {
	try {

		const token = getToken(req);
		const master = isMaster(token);

		if (!master.error) {
			next();
			return;
		}

		return isApp(token).then(app => {
			if (!app.error) {
				next();
				return;
			}
			return res.status(app.status || 400).json({
				message: app.message || 'Error',
			});

		});
		// isApp(token).then(app => {
		//
		// 	if (app.error) {
		// 		return res.status(app.status || 400).json({
		// 			message: app.message || 'Error',
		// 		});
		// 	}
		//
		// 	res.locals.application = app.application
		// 	next();
		// }).catch(err => res.status(401))
	} catch (e) {
		return res.sendStatus(401);
	}
}

export function userIsMaster(req) {
	const token = getToken(req);
	return !isMaster(token).error;
}

export function getUserToken(req) {
	return getToken(req);
}
import express from "express";
import webpush from "web-push";
import cors    from 'cors';

// dotenv
import './env.mjs';

// web push
webpush.setVapidDetails(
	`mailto:${process.env.VAPID_MAILTO}`,
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
)

// db
import './db/conn.mjs';

// app
const app = express();

// cors
app.use(cors({origin: true}));

// force https
app.enable('trust proxy')
app.use((request, response, next) => {
	console.log(`ACCESS: ${request.protocol}://${request.headers.host}${request.url}`)

	if (/\.well-known\/acme-challenge/.test(request.url)) {
		next();
	}

	if (process.env.ENV !== 'development' && !request.secure) {
		console.log('HTTPS redirect : https://' + request.headers.host + request.url)
		return response.redirect("https://" + request.headers.host + request.url);
	}
	next();
})

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// force https
app.enable('trust proxy')

// static
app.use(express.static("./public"));
app.use(express.static("./public/assets"));

// Routes
import appsRoutes           from './routes/apps.js';
import notificationsRoutes from './routes/notifications.js';
import subscriptionRoutes          from './routes/subscription.js';
import pushRoutes          from './routes/push.js';
// import testsRoutes          from './routes/tests.js';

//
app.use('/api/apps', appsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/push', pushRoutes);
// app.use(testsRoutes);

/**
 * test routes
 * @type {null}
 */
// import bodyParser from "body-parser";
// // create application/json parser
// let jsonParser = bodyParser.json()
// // create application/x-www-form-urlencoded parser
// let urlencodedParser = bodyParser.urlencoded({ extended: false })
let subscriptionData = null;
app.post('/send-notification', async (req, res) => {
	if (!subscriptionData) {
		console.log('No subscription', req.body)
		res.sendStatus(200);
	} else {
		console.log('Subscription found, body:', req.body)

		let message = JSON.stringify({
			title: req.body.title || 'Titre par défaut',
			body: req.body.body || 'Message par défaut',
		});

		console.log('Sending message :', message)
		console.log('subscriptionData :', subscriptionData)

		webpush.sendNotification(subscriptionData, message).then(result => console.log(result)).catch(err => console.log(err))
		res.sendStatus(200);
	}
})

app.post("/save-subscription", async (req, res) => {
	console.log('Subscription', req.body)
	subscriptionData = req.body.subscription;
	// successful = req.body.successful;
	res.sendStatus(200);
});

app.post("/save-unsubscription", async (req, res) => {
	console.log('Unsubscription', req.body)
	subscriptionData = null;
	res.sendStatus(200);
});

export default app
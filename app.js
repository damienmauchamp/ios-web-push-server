import express from "express";
import webpush from "web-push";
import dotenv  from "dotenv";
import cors    from 'cors';

// dotenv
dotenv.config();

// web push
webpush.setVapidDetails(
	`mailto:${process.env.VAPID_MAILTO}`,
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
)

// app
const app = express();
app.use(express.json());

// force https
app.enable('trust proxy')

// cors
app.use(cors({origin: true}));

// force https
app.enable('trust proxy')
app.use((request, response, next) => {
	console.log(`ACCESS: ${request.protocol}://${request.headers.host}${request.url}`)
	if (process.env.ENV !== 'development' && !request.secure) {
		console.log('HTTPS redirect : https://' + request.headers.host + request.url)
		return response.redirect("https://" + request.headers.host + request.url);
	}
	next();
})

// static
app.use(express.static("./public"));

// Routes
import appRoutes           from './routes/apps.js';
import notificationsRoutes from './routes/notifications.js';
import pushRoutes          from './routes/push.js';

//
app.use(appRoutes);
app.use(notificationsRoutes);
app.use(pushRoutes);

export default app


// import {fileURLToPath} from 'url';
// import {dirname}       from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// app.get('', (req, res) => {
// 	res.sendFile('public/index.html', {root: __dirname});
// });
//
// app.get('/', (req, res) => {
// 	res.sendFile('public/index.html', {root: __dirname});
// });
/*

app.use((request, response, next) => {

	console.log(`ACCESS: ${request.protocol}://${request.headers.host}${request.url}`)

	if (process.env.ENV !== 'development' && !request.secure) {
		console.log('HTTPS redirect : https://' + request.headers.host + request.url)
		return response.redirect("https://" + request.headers.host + request.url);
	}
	next();
})

// go
let subscriptionData = null;
app.get('/send-notification', (req, res) => {
	console.log('Sending')
	if (subscriptionData) {
		console.log('subscriptionData', subscriptionData)


		let message = JSON.stringify({
			title: 'Notifications',
			body: 'Hello world of strings!',
		});
		// message = 'Hello world!';

		webpush.sendNotification(subscriptionData, message).then(result => console.log(result)).catch(err => console.log(err))
	} else {
		console.log('No subscription')
	}
	res.sendStatus(200);
})

app.post("/save-subscription", async (req, res) => {
	console.log('Subscription')
	subscriptionData = req.body;
	res.sendStatus(200);
});
*/
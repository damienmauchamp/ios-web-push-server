// const baseUrl = ''; // 'https://pi.dmchp.fr:33667';
const publicKey = "BKe9_9n2T7H390_cF5AncgzlIfv5rH0pKWm62aCqt60VFTsWTiCoYh9u2ALkwv_xIfjIPviDSESVPZ-Z7xZNlMY"
const appDev = {
	"_id": "64299f8c4ab02f51a70ca340",
	"name": "My Test !",
	"token": "eyJhbGciOiJIUzI1NiJ9.NjQyOTlmOGM0YWIwMmY1MWE3MGNhMzQw.erU65DGkzgRALOFwPMlEAJmbqLsXr8VgzI7Q0m_spW8",
	"notifications": [
		'64299f8d4ab02f51a70ca342', // global
	],
	"disabled": false,
	"__v": 0
}
const appToken = appDev.token;
// const serviceWorkerPath = 'serviceworker.js';
const serviceWorkerPath = '../serviceworker.js';

let getAppToken = () => document.querySelector('#appToken').value || appDev.token;
let getNotificationId = () => document.querySelector('#notificationId').value;
let getDefaultNotificationId = () => document.querySelector('#notificationId option[data-default="1"]').value;

/**
 * Création d'une application
 * @method POST /api/apps
 * @param subscription
 * @param {String|null} notificationId
 * @returns {Promise<Response>}
 */
let postSubscription = (subscription, notificationId = null) => post('/api/subscription', {
	subscription: subscription,
	notificationId: notificationId,
}, getAppToken()).then(res => {
	console.log(res, '[sub] ok')
	// todo : sendGlobal( va cherche l'ID de la notif en back)
	// if (!notificationId) {
	// 	return;
	// }
	sendAllNotification(getNotificationId(), 'Nous avons un nouvel abonné !', 'Nouvel abonné')
	sendPersonalNotification(getNotificationId(), subscription, "J'suis abonné !", 'Bienvenue !');
}).catch(err => {
	console.error(err, '[sub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

let deleteSubscription = (subscription, notificationId = null) => del('/api/subscription', {
	subscription: subscription,
	notificationId: notificationId || getNotificationId(),
}, getAppToken()).then(res => {
	console.log(res, '[unsub] ok')
	sendAllNotification(getNotificationId(), 'Quelqu\'un nous quitte !', 'Oh nooon !')
}).catch(err => {
	console.error(err, '[unsub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

let sendNotification = (body = null, title = null, notificationId = null, subscription = null) => post("/api/push", {
	title: title,
	body: body,
	notificationId: notificationId,
	subscription: subscription,
}, getAppToken()).then(res => {
	console.log(res, '[send] ok')
}).catch(err => {
	console.error(err, '[send] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

let sendAllNotification = (notificationId = null, body = null, title = null) => sendNotification(body, title, notificationId);
let sendPersonalNotification = (notificationId = null, subscription, body = null, title = null) => sendNotification(body, title, notificationId, subscription);



/////////////////////////////////////////////////////////
let post = (url, body = {}, token = null) => {
	let headers = {"Content-Type": "application/json"}
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	return fetch(url, {
		method: "post",
		headers: headers,
		body: JSON.stringify(body),
	});
}
let del = (url, body = {}, token = null) => {
	let headers = {"Content-Type": "application/json"}
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	return fetch(url, {
		method: "delete",
		headers: headers,
		body: JSON.stringify(body),
	});
}
/////////////////////////////////////////////////////////
// RUN
let init = async () => {
	const registration = await navigator.serviceWorker.register(serviceWorkerPath, {
		scope: "./",
	});

	// appSubscribe
	let appSubscribeButton = document.getElementById('appSubscribe')
	appSubscribeButton.addEventListener("click", async () => {

		// Triggers popup to request access to send notifications
		const result = await window.Notification.requestPermission();
		if (result !== 'granted') { // "denied"
			// If the user rejects the permission result will be "denied"
			alert('not granted')
			return true;
		}

		registration.pushManager.subscribe({
			applicationServerKey: urlBase64ToUint8Array(publicKey),
			userVisibleOnly: true,
		}).then(postSubscription).catch(e => {
			alert('Subscription failed : ' + e)
		})
	});

	// todo : registration.pushManager.unsubscribe :bool, unsubscribe from all

	// appUnsubscribe, for specific app/notification
	let appUnsubscribeButton = document.getElementById('appUnsubscribe')
	appUnsubscribeButton.addEventListener("click", async () => {
		// registration.pushManager.subscribe({
		// 	applicationServerKey: urlBase64ToUint8Array(publicKey),
		// 	userVisibleOnly: true,
		// }).then(deleteSubscription).catch(e => {
		registration.pushManager.getSubscription().then(subscription => {
			console.log('subscription:', subscription)
			if (!subscription) {
				alert('Not subscribed !!');
				return;
			}

			deleteSubscription(subscription);
		}).catch(e => {
			alert('Unsubscription failed : ' + e)
		})
	});

	// appSendTestNotification, testing
	let appSendPersonalTestNotificationButton = document.getElementById('appSendPersonalTestNotification')
	appSendPersonalTestNotificationButton.addEventListener("click", async () => {
		registration.pushManager.getSubscription().then(subscription => {
			console.log('subscription:', subscription)
			if (!subscription) {
				alert('Not subscribed !!');
				return;
			}
			sendPersonalNotification(getNotificationId(), subscription, 'Body perso', 'Titre perso')
		}).catch(e => {
			alert('Unsubscription failed : ' + e)
		})

	});
	let appSendAllTestNotificationButton = document.getElementById('appSendAllTestNotification')
	appSendAllTestNotificationButton.addEventListener("click", async () => {
		sendAllNotification(getNotificationId(), 'Body global !', 'Titre global !')
	});



}
init();

/////////////////////////////////////////////////////////
// UTILES
function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, "+")
		.replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
class PushManager {

	registration = null

	static run = async () => {
		let test = new PushManager()
		test.registration = await navigator.serviceWorker.register("serviceworker.js", {
			scope: "./",
		});
		return test;
	}

	subscribe = () => {
		console.log('subscribe()', {
			registration: registration,
			pushManager: registration.pushManager,
		})
		if (!registration) {
			return;
		}

		// Triggers popup to request access to send notifications
		window.Notification.requestPermission()
			.then(result => {
				if (result !== 'granted') {
					throw new Error('Not granted');
				}

				// If the user rejects the permission result will be "denied"
				this.registration.pushManager.subscribe({
					applicationServerKey: urlBase64ToUint8Array(publicKey),
					userVisibleOnly: true,
				}).then(postSubscription).catch(e => {
					alert('Subscription failed : ' + e)
				})

			}).catch(err => alert(err));
	}

}

const test = PushManager.run();


const registration = navigator.serviceWorker.register("serviceworker.js", {
	scope: "./",
});


///////
*/


/***/

let send = (body = null, title = null) => post("/send-notification", {
	title: title,
	body: body,
}).then(res => console.log('[RES] res', res)).catch(err => console.error('[RES] err', err))

let saveSubscription = (subscription) => post("/save-subscription", {
	subscription: subscription,
}).then(res => {
	console.log(res, '[sub] ok')
	send("J'suis abonné !", 'Ouais ouais ouaisssssss');
}).catch(err => {
	console.error(err, '[sub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

let saveUnsubscription = (subscription, successful) => post("/save-unsubscription", {
	subscription: subscription,
	successful: successful,
}).then(res => {
	console.log(res, '[unsub] ok')
}).catch(err => {
	console.error(err, '[unsub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

async function run() {
	// A service worker must be registered in order to send notifications on iOS
	const registration = await navigator.serviceWorker.register(
		serviceWorkerPath,
		{
			scope: "./",
		}
	);

	const sendButton = document.getElementById("send");
	sendButton.addEventListener("click", async () => {
		await send('Big test', 'Ceci est un putain de test !');
	});

	const button = document.getElementById("subscribe");
	button.addEventListener("click", async () => {
		// Triggers popup to request access to send notifications
		const result = await window.Notification.requestPermission();

		if (result !== 'granted') { // "denied"
			alert('not granted')
			return true;
		}

		// If the user rejects the permission result will be "denied"
		registration.pushManager.subscribe({
			applicationServerKey: urlBase64ToUint8Array(publicKey),
			userVisibleOnly: true,
		}).then(saveSubscription).catch(e => {
			alert('Subscription failed : ' + e)
		})
	});

	const unsubscribeButton = document.getElementById("unsubscribe");
	unsubscribeButton.addEventListener("click", async () => {
		// Triggers popup to request access to send notifications
		const result = await window.Notification.requestPermission();

		if (result !== 'granted') { // "denied"
			alert('not granted')
			return true;
		}

		registration.pushManager.getSubscription().then((subscription) => {

			subscription.unsubscribe().then((successful) => {
				saveUnsubscription(subscription, successful)
			}).catch((e) => {
				alert('Unsubscription failed : ' + e)
			});
		});

		// registration.pushManager.unsubscribe({
		// 	applicationServerKey: urlBase64ToUint8Array(publicKey),
		// 	userVisibleOnly: true,
		// }).then(unsubscription => {
		// 	fetch(baseUrl + "/save-unsubscription", {
		// 		method: "post",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify(unsubscription),
		// 	}).then(res => {
		// 		console.log(res, 'sub ok')
		// 		send();
		// 	}).catch(err => {
		// 		console.log(err, 'sub err : ' + err + ' ' + err.statusText + ' - ' + err.status)
		// 	});
		//
		// }).catch(e => {
		// 	alert('Subscription failed : ' + e)
		// })
	});
}

run();

// Unsubscribe
// navigator.serviceWorker.ready.then((reg) => {
// 	reg.pushManager.getSubscription().then((subscription) => {
// 		subscription
// 			.unsubscribe()
// 			.then((successful) => {
// 				// You've successfully unsubscribed
// 			})
// 			.catch((e) => {
// 				// Unsubscribing failed
// 			});
// 	});
// });
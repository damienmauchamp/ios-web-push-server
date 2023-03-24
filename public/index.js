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

const baseUrl = ''; // 'https://pi.dmchp.fr:33667';
const publicKey = "BKe9_9n2T7H390_cF5AncgzlIfv5rH0pKWm62aCqt60VFTsWTiCoYh9u2ALkwv_xIfjIPviDSESVPZ-Z7xZNlMY"

// let send = () => fetch(baseUrl + "/send-notification")
let send = (body = null, title = null) => fetch(baseUrl + "/send-notification", {
	method: "post",
	headers: {"Content-Type": "application/json"},
	body: {
		title: title,
		body: body,
	},
}).then(res => console.log('[RES] res', res)).catch(err => console.error('[RES] err', err))

let saveSubscription = (subscription) => fetch(baseUrl + "/save-subscription", {
	method: "post",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify({
		subscription: subscription,
	}),
}).then(res => {
	console.log(res, '[sub] ok')
	send();
}).catch(err => {
	console.error(err, '[sub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

let saveUnsubscription = (subscription, successful) => fetch(baseUrl + "/save-unsubscription", {
	method: "post",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify({
		subscription: subscription,
		successful: successful,
	}),
}).then(res => {
	console.log(res, '[unsub] ok')
}).catch(err => {
	console.error(err, '[unsub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});

async function run() {
	// A service worker must be registered in order to send notifications on iOS
	const registration = await navigator.serviceWorker.register(
		"serviceworker.js",
		{
			scope: "./",
		}
	);

	const sendButton = document.getElementById("send");
	sendButton.addEventListener("click", async () => {
		await send();
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
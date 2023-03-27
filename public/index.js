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
const appId = '64213ca5d57907b3aa8dd6d5';
const appToken = 'eyJhbGciOiJIUzI1NiJ9.NjQyMTNjYTVkNTc5MDdiM2FhOGRkNmQ1.jbvDrIrhUdI_tuyONc5FctkswNM0bKGfmVGvHrb36b4';

//////
let registration;
window.addEventListener('load', event => {
	registration = navigator.serviceWorker.register(
		"serviceworker.js",{scope: "./"}
	)
})

//
let postSubscription = (subscription) => post("/api/subscription", {
	subscription: subscription,
}, appToken).then(res => {
	console.log(res, '[sub] ok')
	// todo : // send("J'suis abonné !", 'Ouais ouais ouaisssssss');
}).catch(err => {
	console.error(err, '[sub] err : ' + err + ' ' + err.statusText + ' - ' + err.status)
});


let subscribe = () => {
	// Triggers popup to request access to send notifications
	window.Notification.requestPermission()
		.then(result => {
			if (result !== 'granted') {
				throw new Error('Not granted');
			}

			// If the user rejects the permission result will be "denied"
			registration.pushManager.subscribe({
				applicationServerKey: urlBase64ToUint8Array(publicKey),
				userVisibleOnly: true,
			}).then(postSubscription).catch(e => {
				alert('Subscription failed : ' + e)
			})

		}).catch(err => alert(err));
}


///////


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
		"serviceworker.js",
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
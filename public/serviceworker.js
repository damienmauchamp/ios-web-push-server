self.addEventListener("push", async (event) => {
	console.log('push event:', event)
	console.log('event.data', event.data)

	let title, body;
	// const { title, body } = await event.data.json();

	try {
		let json = await event.data.json()
		console.log('json', json)

		title = json.title || 'json.title';
		body = json.body || 'json.body';
	} catch (jsonErr) {
		console.log('jsonErr', jsonErr)

		try {
			let text = await event.data.text();
			console.log('text', text)

			title = 'title';
			body = text;
		} catch (textErr) {
			console.log('textErr', textErr)

			title = 'title';
			body = 'body';
		}

	}

	// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
	await self.registration.showNotification(title, {
		body,
	});
});

// réinitialiser : chrome://serviceworker-internals/
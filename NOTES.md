#

`auth` a l'air d'être l'identifiant de l'appareil

## subscription

```bash
ACCESS: POST https://web.push.dmchp.fr/save-subscription
Subscription {
  subscription: {
    endpoint: 'https://fcm.googleapis.com/fcm/send/eu_RjBgB4HU:APA91bFB-lxRuIl3TZtMJNzwQxo9W9AWV1MtIfesfyS99_SDKV-WD33XzwBfx0IifkmnlkQT_mmRgOBSIsA8lk0PimkP2-zF9_5XoDWjv8TDqqUs1cQrmoyJ_HhIHhYR1WNvvuczuqIh',
    expirationTime: null,
    keys: {
      p256dh: 'BCITVy_-i-BZ2z7XHj4rlP7ZthiuMV2exafF98ODvO2XS0w_-wqBZdStknHJFWp8Rp5LSjypDJQE4svqt4bx5Uo',
      auth: 'NGUq-oEJZiW_wy6HVuvGGg'
    }
  }
}
```

## unsubscription
```bash
ACCESS: POST https://web.push.dmchp.fr/save-unsubscription
Unsubscription {
  subscription: {
    endpoint: 'https://fcm.googleapis.com/fcm/send/eu_RjBgB4HU:APA91bFB-lxRuIl3TZtMJNzwQxo9W9AWV1MtIfesfyS99_SDKV-WD33XzwBfx0IifkmnlkQT_mmRgOBSIsA8lk0PimkP2-zF9_5XoDWjv8TDqqUs1cQrmoyJ_HhIHhYR1WNvvuczuqIh',
    expirationTime: null,
    keys: {
      p256dh: 'BCITVy_-i-BZ2z7XHj4rlP7ZthiuMV2exafF98ODvO2XS0w_-wqBZdStknHJFWp8Rp5LSjypDJQE4svqt4bx5Uo',
      auth: 'NGUq-oEJZiW_wy6HVuvGGg'
    }
  },
  successful: true
}
```

## sending

```bash
ACCESS: POST https://web.push.dmchp.fr/send-notification
Subscription found { title: null, body: null }
Sending message : {"title":"Titre par défaut","body":"Message par défaut"}
subscriptionData : {
  endpoint: 'https://fcm.googleapis.com/fcm/send/eu_RjBgB4HU:APA91bFB-lxRuIl3TZtMJNzwQxo9W9AWV1MtIfesfyS99_SDKV-WD33XzwBfx0IifkmnlkQT_mmRgOBSIsA8lk0PimkP2-zF9_5XoDWjv8TDqqUs1cQrmoyJ_HhIHhYR1WNvvuczuqIh',
  expirationTime: null,
  keys: {
    p256dh: 'BCITVy_-i-BZ2z7XHj4rlP7ZthiuMV2exafF98ODvO2XS0w_-wqBZdStknHJFWp8Rp5LSjypDJQE4svqt4bx5Uo',
    auth: 'NGUq-oEJZiW_wy6HVuvGGg'
  }
}
{
  statusCode: 201,
  body: '',
  headers: {
    location: 'https://fcm.googleapis.com/0:1679685371660275%e609af1cf9fd7ecd',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'SAMEORIGIN',
    'x-xss-protection': '0',
    date: 'Fri, 24 Mar 2023 19:16:11 GMT',
    'content-length': '0',
    'content-type': 'text/html; charset=UTF-8',
    'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
    connection: 'close'
  }
}
```
___

## subscriptionData

```json
{
	"endpoint": "https://web.push.apple.com/QAMi-nVKTXcb61k-gKgfN_W0k405DmRNqVPi-c4swXfWEzzT_XqLvoQLBeIGkfNqLO2vwY8414dsAd0pCiB1FKlsNCT4TbqVExlrLy0_BjdREDpkZhFo4LQzoBNZI21lrwVgDdAzwsIbGRxN9roSMo6ghZBArR4BHB4SC301uNQ",
	"keys": {
		"p256dh": "BF_JGaM-CzAliR5Vs3XG9eHxdNhgARhSmP9kB_veFL2BBpVEcMK37VC_M5LGch8agaM-kqSiZ6uLFr5XT3fbwCs",
		"auth": "cQ7nWc3L-iLBMtrthKaitg"
	}
}
```

## webpush.sendNotification result
```json
{
  "statusCode": 201,
  "body": "",
  "headers": {
    "content-type": "text/plain; charset=UTF-8",
    "content-length": "0",
    "apns-id": "2E4DCF5F-A045-7054-D9EA-39A2157EA331"
  }
}
```
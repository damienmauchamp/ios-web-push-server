# ios-web-push-server
Serveur pour gérer les Web Push Notifications avec différentes applications


## Mise en place

Générer les clés :

```bash
$ ./node_modules/.bin/web-push generate-vapid-keys
```

Ce qui sera généré :

```bash
=======================================

Public Key:
<PUBLIC_KEY>

Private Key:
<PRIVATE_KEY>

=======================================
```

Et les mettre dans le .env

```dotenv
VAPID_PUBLIC_KEY=<PUBLIC_KEY>
VAPID_PRIVATE_KEY=<PRIVATE_KEY>
```
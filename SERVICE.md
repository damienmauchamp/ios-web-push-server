Créer un fichier `ios-web-push.service`

```bash
[Unit]
Description=iOS Web Push Server

[Service]
ExecStart=node /var/www/web.push.dmchp.fr/server/index.mjs
Restart=always
User=nobody
Group=nogroup
#User=freebox
#Group=freebox
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/var/www/web.push.dmchp.fr

[Install]
WantedBy=multi-user.target
```

Copier le fichier dans `/etc/systemd/system`

Start it with `systemctl start ios-web-push`

Enable it to run on boot with `systemctl enable ios-web-push`.

See logs with `journalctl -u ios-web-push`






## Sources 

- https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service
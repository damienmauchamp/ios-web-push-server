import app   from './app.js'
import https from "https";
import fs    from "fs";

// http
app.listen(process.env.HTTP_PORT, () => {
	console.log(`HTTP app listening on port ${process.env.HTTP_PORT}`)
})

// https
https.createServer({
	key: fs.readFileSync(process.env.PRIVATE_KEY || 'certs/private.pem'),
	cert: fs.readFileSync(process.env.CERT || 'certs/cert.pem'),
}, app).listen(process.env.HTTPS_PORT, () => {
	console.log(`HTTPS app listening on port ${process.env.HTTPS_PORT}`)
});

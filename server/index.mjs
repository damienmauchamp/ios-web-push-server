import app             from './app.js'
import https           from "https";
import fs              from "fs";
import {fileURLToPath} from 'url';
import path            from "path";

//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// http
app.listen(process.env.HTTP_PORT, () => {
	console.log(`HTTP app listening on port ${process.env.HTTP_PORT}`)
})

// https
https.createServer({
	key: fs.readFileSync(`${path.normalize(__dirname)}/certs/${process.env.PRIVATE_KEY || 'private.pem'}`),
	cert: fs.readFileSync(`${path.normalize(__dirname)}/certs/${process.env.CERT || 'cert.pem'}`),
}, app).listen(process.env.HTTPS_PORT, () => {
	console.log(`HTTPS app listening on port ${process.env.HTTPS_PORT}`)
});

import mongoose from 'mongoose';
import '../env.mjs'

mongoose.connect(process.env.DATABASE_URL, {}).then(() => {

	let dbname = process.env.DATABASE_URL.replace(/.+(\/([^?\/]*))(\?[^?]*)?$/, '$1');
	if (process.env.DATABASE_URL === dbname) {
		dbname = 'default';
	}

	console.log(`CONNECTION SUCCESS (${dbname})`)
}).catch(err => {
	console.log('CONNECTION ERROR', err)
});
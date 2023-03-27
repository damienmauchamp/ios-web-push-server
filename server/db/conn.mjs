import mongoose from 'mongoose';
import '../env.mjs'

mongoose.connect(process.env.DATABASE_URL, {}).then(() => {
	console.log('CONNECTION SUCCESS')
}).catch(err => {
	console.log('CONNECTION ERROR', err)
});
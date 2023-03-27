import mongoose    from "mongoose";
import Application from './applications.js';

const {Schema} = mongoose;

const subscription = Schema({
	app: {
		type: Schema.Types.ObjectId,
		ref: 'Application',
		require: true,
	},
	endpoint: {
		type: String,
		required: false,
	},
	expirationTime: {
		type: String,
		required: false,
	},
	keys: {
		p256dh: {
			type: String,
			required: false,
		},
		auth: {
			type: String,
			required: false,
		},
	},
	data: {
		// ...
	}
})

export default mongoose.model('Subscription', subscription)
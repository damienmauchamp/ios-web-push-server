import mongoose from "mongoose";
import AppNotification from './notifications.js';

const {Schema} = mongoose;

const application = Schema({
	name: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	notifications: [
		{
			type: Schema.Types.ObjectId,
			ref: 'AppNotification'
		}
	],
	disabled: {
		type: Boolean,
		default: false,
		required: true
	}
}, {
	query: {
		byName: (name) => {
			return this.where({name: new RegExp(name, 'i')});
		},
	}
})

export default mongoose.model('Application', application)
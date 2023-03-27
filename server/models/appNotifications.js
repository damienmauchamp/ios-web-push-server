import mongoose    from "mongoose";
import Application from './applications.js';
import Subscription from './subscriptions.js';

const {Schema} = mongoose;

const appNotification = Schema({
	app: {
		type: Schema.Types.ObjectId,
		ref: 'Application',
		require: true,
	},
	parent: {
		type: Schema.Types.ObjectId,
		ref: 'AppNotification',
		require: false,
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'AppNotification',
		require: false,
	}],
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	default: {
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
	},
	subscriptions: [{
		type: Schema.Types.ObjectId,
		ref: 'Subscription',
		require: false,
	}],
	disabled: {
		type: Boolean,
		default: false,
		required: true
	}
})

export default mongoose.model('AppNotification', appNotification)
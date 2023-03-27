import mongoose    from "mongoose";
import Application from './apps.js';

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
			required: false,
		},
		body: {
			type: String,
			required: false,
		},
	},
	disabled: {
		type: Boolean,
		default: false,
		required: true
	}
})

export default mongoose.model('AppNotification', appNotification)
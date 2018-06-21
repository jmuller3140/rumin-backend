const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			    type: String,
			    required: true,
			    trim: true
		},
		date: {
			type: Date,
			required: true
		},
		entry: {
			type: String,
			required: true
		}
});

module.exports = mongoose.model('Entry', entrySchema);
const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
	email: { type: String, unique: true},
	accepted: { type: Boolean, default: false},
	password: String,
	cv: [
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CV'
		}
	],
	date: {
		type: Date,
		default: Date.now
	} 
})

module.exports = mongoose.model('Employee', EmployeeSchema)
const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
	birthDate: {type: Date },
	gender: String,
	citizenship: String,
	workPermition: String,
	email: String,
	phone: String,
	address: String,
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
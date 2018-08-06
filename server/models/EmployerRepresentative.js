const mongoose = require('mongoose')

const EmployerRepresentativeSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
	email: { type: String, unique: true },
	phone: String,
	accepted: { type: Boolean, default: false }
})

module.exports = mongoose.model('EmployerRepresentative', EmployerRepresentativeSchema)
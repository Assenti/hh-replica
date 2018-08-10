const mongoose = require('mongoose')

const EmployerSchema = mongoose.Schema({
	name: String,
	site: String,
	employeesQuantity: Number,
	city: String,
	vacancies: [
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vacancy'
		}
	],
	representatives: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'EmployerRepresentative'
		}
	],
	date: {
		type: Date,
		default: Date.now
	},
	link: String 
})

module.exports = mongoose.model('Employer', EmployerSchema)
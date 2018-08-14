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
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	invited: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CV'
		}
	],
	date: {
		type: Date,
		default: Date.now
	},
	link: String 
})

module.exports = mongoose.model('Employer', EmployerSchema)
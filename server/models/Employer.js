const mongoose = require('mongoose')

const EmployerSchema = mongoose.Schema({
	name: String,
	dateOfFoundation: { type: Date },
	about: String,
	site: String,
	vacancies: [
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vacancy'
		}
	],
	date: {
		type: Date,
		default: Date.now
	},
	link: String 
})

module.exports = mongoose.model('Employer', EmployerSchema)
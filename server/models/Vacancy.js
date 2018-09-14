const mongoose = require('mongoose')

const VacancySchema = mongoose.Schema({
	position: String,
	salary: Number,
	xpLength: Number,
	workSchedule: String,
	requirements: String,
	preferable: String,
	conditions: String,
	employer_name: String,
	employer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Employer'
	},
	skills: [{ type: String }],
	responses: [
		{
			cv_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'CV'
			},
			employee_firstname: String,
			employee_lastname: String,
			date: { type: Date,default: Date.now }
		}
	],
	date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Vacancy', VacancySchema)
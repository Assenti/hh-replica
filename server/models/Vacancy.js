const mongoose = require('mongoose')

const VacancySchema = mongoose.Schema({
	position: String,
	salary: Number,
	xpLength: Number,
	workSchedule: String,
	requirements: String,
	preferable: String,
	conditions: String,
	employer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Employer'
	},
	responses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Vacancy', VacancySchema)
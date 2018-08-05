const mongoose = require('mongoose')

const VacancySchema = mongoose.Schema({
	position: String,
	xpLength: Number,
	workSchedule: String,
	requirements: String,
	preferable: String,
	conditions: String,
	skills: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Skill'
		}
	]
})

module.exports = mongoose.model('Vacancy', VacancySchema)
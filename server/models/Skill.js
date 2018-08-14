const mongoose = require('mongoose')

const SkillSchema = mongoose.Schema({
	skill: String,
	cv: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CV'
	},
	vacancy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vacancy'
	}
})

module.exports = mongoose.model('Skill', SkillSchema)
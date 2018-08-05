const mongoose = require('mongoose')

const SkillSchema = mongoose.Schema({
	skill: String
})

module.exports = mongoose.model('Skill', SkillSchema)
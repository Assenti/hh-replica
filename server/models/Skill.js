const mongoose = require('mongoose')

const SkillSchema = mongoose.Schema({
	name: String
})

module.exports = mongoose.model('Skill', SkillSchema)
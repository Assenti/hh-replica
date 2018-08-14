const mongoose = require('mongoose')

const CVSchema = mongoose.Schema({
	birthDate: {type: Date },
	gender: String,
	citizenship: String,
	address: String,
	position: String,
	xpLength: Number,
	specialization: String,
	salary: Number,
	education: String,
	courses: String,
	work: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	skills: [ 
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Skill'
		}
	],
	responses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Employer'
		}
	],
	date: { 
		type: Date,
		default: Date.now
	},
	link: String
})

module.exports = mongoose.model('CV', CVSchema)
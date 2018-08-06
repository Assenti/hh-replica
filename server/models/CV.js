const mongoose = require('mongoose')

const CVSchema = mongoose.Schema({
	birthDate: {type: Date },
	gender: String,
	citizenship: String,
	workPermition: String,
	address: String,
	phone: String,
	position: String,
	xpLength: Number,
	specialization: String,
	salary: Number,
	employment: String,
	workSchedule: String,
	education: [
		{ 
			almaMater: String,
			specialization: String,
			graduateDate: { type: Date},
			degree: String
		}
	],
	courses: [
		{ 
			almaMater: String,
			specialization: String,
			completionDate: { type: Date}
		}
	],
	workExperience: [
		{
			employer: String,
			position: String,
			startedDate: { type: Date},
			completionDate: { type: Date},
			functional: String
		}
	],
	skills: [ 
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Skill'
		}
	],
	about: String,
	languages: [
		{ 
			language: String,
			degree: String 
		}
	],
	date: { 
		type: Date,
		default: Date.now
	},
	link: String
})

module.exports = mongoose.model('CV', CVSchema)
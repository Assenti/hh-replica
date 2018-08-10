const mongoose = require('mongoose')

const CVSchema = mongoose.Schema({
	birthDate: {type: Date },
	gender: String,
	citizenship: String,
	address: String,
	phone: String,
	position: String,
	xpLength: Number,
	specialization: String,
	salary: Number,
	education: String,
	courses: String,
	workPlace: String,
	employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Employee'
	},
	skills: [ 
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Skill'
		}
	],
	date: { 
		type: Date,
		default: Date.now
	},
	link: String
})

module.exports = mongoose.model('CV', CVSchema)
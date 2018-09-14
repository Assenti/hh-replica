const mongoose = require('mongoose')

const CVSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
	phone: String,
	email: String,
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
	skills: [{ type: String }],
	invites: [
		{
			employer_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Employer'
			},
			employer_name: String,
			date: {type: Date, default: Date.now}
		}
	],
	watches: [
		{
			employer_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Employer'
			},
			employer_name: String,
			date: {type: Date, default: Date.now}
		}
	],
	date: { 
		type: Date,
		default: Date.now
	},
	link: String
})

module.exports = mongoose.model('CV', CVSchema)
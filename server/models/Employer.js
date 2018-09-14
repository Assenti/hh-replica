const mongoose = require('mongoose')

const EmployerSchema = mongoose.Schema({
	name: String,
	site: String,
	employeesQuantity: Number,
	city: String,
	users: [
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	invited: [
		{
			cv_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'CV'
			},
			cv_position: String,
			employee_firstname: String,
			employee_lastname: String,
			date: { type: Date,default: Date.now }
		}
	],
	date: {
		type: Date,
		default: Date.now
	},
	link: String 
})

module.exports = mongoose.model('Employer', EmployerSchema)
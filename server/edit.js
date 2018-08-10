const Employer = require('./models/Employer')

const redis = require('redis')
const client = redis.createClient()
client.on('error', (err)=> console.log(`Error: ${err}`))


const editRedis = {
	edit: function (id){
		console.log(id)
		Employer.findById(id).populate('vacancies')
		.exec((err, employer)=> {
			if(err) return 
			client.set(employer._id.toString(), JSON.stringify(employer), redis.print)
		})
	},
	del: function (id){
		console.log(id)
		Employer.findById(id).populate('vacancies')
		.exec((err, employer)=> {
			if(err) return 
			client.del(id.toString(), redis.print)
		})
	}
}



module.exports = editRedis
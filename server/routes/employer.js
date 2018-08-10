const express = require('express')
const router = express.Router()

const redis = require('redis')
const editRedis = require('../edit')
const client = redis.createClient()
client.on('error', (err)=> console.log(`Error: ${err}`))

const Employer = require('../models/Employer')
const User = require('../models/User')
const Vacancy = require('../models/Vacancy')


// END POINTS
router.get('/:id', (req, res, next)=>{
 	client.get(req.params.id, (err, employer)=> {
 		if(err) return res.send(err)
 		if(employer) {
 			res.send(JSON.parse(employer))
 		} else {
 			Employer.findById(req.params.id).populate('vacancies')
			.exec((err, employers)=>{
				if(err) return res.send(err);
					client.set(req.params.id, JSON.stringify(employer), redis.print)
					res.send(employer);
				})
 		}
 	})		
 })

router.get('/', (req, res, next)=> {
	Employer.find()
	.exec((err, employers)=> {
		if(err) return res.send(err)
		res.send(employers)
	})
})


router.post('/signup', (req, res, next)=> {
	let employer = new Employer({
		name: req.body.name,
		site: req.body.site,
		employeesQuantity: req.body.employeesQuantity,
		city: req.body.city
	})
	employer.save((err, employer)=> {
		if(err) res.send(err)
		res.sendStatus(200)
	})

})




module.exports = router
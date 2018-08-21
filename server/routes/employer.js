const express = require('express')
const router = express.Router()

const Employer = require('../models/Employer')
const User = require('../models/User')
const Vacancy = require('../models/Vacancy')


// END POINTS
router.get('/:id', (req, res, next)=>{
	Employer.findById(req.params.id).populate('vacancies')
	.exec((err, employer)=>{
		if(err) return res.send(err);
		User.find({ employer: req.params.id })
		.exec((err, users)=> {
			if(err) return res.send(err)
			res.send({employer: employer, users: users })
		})
	})
})

router.get('/search/:page', (req, res, next)=>{
 	Employer.find().skip((req.params.page - 1) * 5)
 		.limit(5)
 		.exec((err, employers)=>{
 			if(err) return res.send(err);
 			Employer.countDocuments().exec((err, count)=>{
 				if(err) return res.send(err)
 				res.send({results: employers, count: count});
 			})
 			
 		})
})

router.get('/', (req, res, next)=> {
	Employer.find()
	.exec((err, employers)=> {
		if(err) return res.send(err)
		res.send(employers)
	})
})

router.get('/search/:query', (req, res, next)=> {
	const myRexExp = new RegExp(`${req.params.query}`, 'i')
	Employer.find({ name: myRexExp })
	.limit(5)
	.exec((err, employers)=> {
		if(err) return res.send(err)
		res.send(employers)
	})
})


module.exports = router
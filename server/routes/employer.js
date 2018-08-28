const express = require('express')
const router = express.Router()

const Employer = require('../models/Employer')
const User = require('../models/User')
const Vacancy = require('../models/Vacancy')
const CV = require('../models/CV')


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

router.get('/search/common/:query', (req, res, next)=> {
	const myRexExp = new RegExp(`${req.params.query}`, 'i')
	Employer.find({ name: myRexExp })
	.limit(5)
	.exec((err, employers)=> {
		if(err) return res.send(err)
		res.send(employers)
	})
})

router.delete('/:employer_id/:invite_id/:vacancy_id', (req, res, next)=> {
	Employer.findById(req.params.employer_id)
	.exec((err, employer)=> {
		if(err) return res.send(err)
		let invites = employer.invited.filter((invite)=> invite != req.params.invite_id)
		employer.invited = invites;
		employer.save((err, employer)=> {
			if(err) return res.send(err)
			Vacancy.findById(req.params.vacancy_id)
			.exec((err, vacancy)=> {
				if(err) return res.send(err)
				CV.findById(req.params.invite_id)
				.exec((err, cv)=> {
					if(err) return res.send(err)
					let index = vacancy.responses.indexOf(cv.user)
					vacancy.responses.splice(index, 1)
					vacancy.save((err, vacancy)=> {
						if(err) return res.send(err)
						res.sendStatus(200)
					})
				})
				
			})
			
		})
	})
})


module.exports = router
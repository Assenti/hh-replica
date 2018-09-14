const express = require('express')
const router = express.Router()

const Employer = require('../models/Employer')
const User = require('../models/User')
const Vacancy = require('../models/Vacancy')
const CV = require('../models/CV')


router.get('/', (req, res, next)=> {
	Employer.find()
	.exec((err, employers)=> {
		if(err) return res.send(err)
		res.send(employers)
	})
})

router.get('/view/:id/:page', (req, res, next)=>{
	Employer.findById(req.params.id)
	.populate('users')
	.exec((err, employer)=>{
		if(err) return res.send(err);
		Vacancy.find({employer: req.params.id})
		.skip((req.params.page - 1) * 5)
		.limit(5)
		.exec((err, vacancies)=> {
			if(err) return res.send(err)
			Vacancy.count({employer: req.params.id})
			.exec((err, count)=> {
				if(err) return res.send(err)
				res.send({employer: employer, vacancies: vacancies, count: count})
			})
		})
	})
})

router.get('/newvacancy/:user_id', (req, res, next)=> {
	Employer.findOne({users: req.params.user_id})
	.exec((err, employer)=> {
		if(err) return console.log(err)
		res.send(employer)
	})
})

router.get('/search/:page', (req, res, next)=>{
 	Employer.find().skip((req.params.page - 1) * 5)
	.limit(5)
	.exec((err, employers)=>{
		if(err) return res.send(err);
		Employer.count().exec((err, count)=>{
			if(err) return res.send(err)
			res.send({results: employers, count: count});
		})
		
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

router.put('/editing', (req, res, next)=> {
	Employer.findById(req.body._id).exec((err, employer)=> {
		if(err) return res.send(err)
		employer.name = req.body.name
		employer.site = req.body.site
		employer.employeesQuantity = req.body.employeesQuantity
		employer.city = req.body.city
		employer.save((err, employer)=> {
			if(err) return res.send(err)
			res.send(employer)
		})
	})
})

router.delete('/deleting/:id', (req, res, next)=> {
	Employer.remove({_id: req.params.id}).exec((err, result)=> {
		if(err) return res.send(err)
		User.remove({employer: req.params.id}).exec((err, results)=> {
			if(err) return res.send(err)
			res.sendStatus(200)
		})
	})
})


module.exports = router
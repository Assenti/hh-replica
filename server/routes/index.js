const express = require('express')
const router = express.Router()

router.use('/employer', require('./employer'))
router.use('/user', require('./user'))
router.use('/cv', require('./cv'))
router.use('/vacancy', require('./vacancy'))

const Vacancy = require('../models/Vacancy')
const CV = require('../models/CV')

router.get('/getsalaries', (req, res, next)=> {
	let allSalaries = [];
	let uniqueSalaries = [];
	Vacancy.find().exec((err, vacancies)=> {
		if(err) return res.send(err)
		CV.find().exec((err, cvs)=> {
			if(err) return res.send(err)
			vacancies.concat(cvs)
			for(let i = 0; i < vacancies.length; i++){
				allSalaries[i] = vacancies[i].salary
			}
			uniqueSalaries = allSalaries.filter((value, index, self)=> { 
			    return self.indexOf(value) === index;
			})
			console.log(uniqueSalaries)
			res.send(uniqueSalaries)
		})
	})
})


module.exports = router
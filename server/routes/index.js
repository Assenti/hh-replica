const express = require('express')
const router = express.Router()

router.use('/employer', require('./employer'))
router.use('/user', require('./user'))
router.use('/cv', require('./cv'))
router.use('/vacancy', require('./vacancy'))

const Vacancy = require('../models/Vacancy')
const Skill = require('../models/Skill')
const CV = require('../models/CV')


router.get('/getsalaries', (req, res, next)=> {
	let uniquesalaries = [];
	if(req.query.query === 'vacancy'){
		Vacancy.find().exec((err, vacancies)=> {
		if(err) return res.send(err)
		let flags = [];
		for(let i=0; i < vacancies.length; i++) {
		    if(flags[vacancies[i].salary]) continue;
		    flags[vacancies[i].salary] = true;
		    uniquesalaries.push(vacancies[i]);
		}
		res.send(uniquesalaries)
	})
	} else if(req.query.query === 'cv'){
		CV.find().exec((err, cvs)=> {
			if(err) return res.send(err)
			let flags = [];
			for(let i=0; i < cvs.length; i++) {
			    if(flags[cvs[i].salary]) continue;
			    flags[cvs[i].salary] = true;
			    uniquesalaries.push(cvs[i]);
			}
			res.send(uniquesalaries)
		})
	}
})

router.get('/getxp', (req, res, next)=> {
	let uniquexp = [];
	if(req.query.query === 'vacancy'){
		Vacancy.find().exec((err, vacancies)=> {
		if(err) return res.send(err)
		let flags = [];
		for(let i=0; i < vacancies.length; i++) {
		    if(flags[vacancies[i].xpLength]) continue;
		    flags[vacancies[i].xpLength] = true;
		    uniquexp.push(vacancies[i]);
		}
		res.send(uniquexp)
	})
	} else if(req.query.query === 'cv'){
		CV.find().exec((err, cvs)=> {
			if(err) return res.send(err)
			let flags = [];
			for(let i=0; i < cvs.length; i++) {
			    if(flags[cvs[i].xpLength]) continue;
			    flags[cvs[i].xpLength] = true;
			    uniquexp.push(cvs[i]);
			}
			res.send(uniquexp)
		})
	}
})

router.get('/getskills/:skill', (req, res, next)=> {
	const myRegExp = new RegExp(`${req.params.skill}`, 'i')
	Skill.find({name: myRegExp}).limit(10).exec((err, skills)=> {
		if(err) return res.send(err)
		let flags = [], uniqueSkills = [];
		for(let i = 0; i < skills.length; i++) {
		    if(flags[skills[i].name]) continue;
		    flags[skills[i].name] = true;
		    uniqueSkills.push(skills[i]);
		}
		res.send(uniqueSkills)
	})
})


module.exports = router
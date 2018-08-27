const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

const Employer = require('../models/Employer')
const User = require('../models/User')
const Vacancy = require('../models/Vacancy')
const Skill = require('../models/Skill')


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: '172.3itstep2017@gmail.com', 
        pass: 'fsnihgdmbxfwhptq' 
    }
});

// END POINTS
router.get('/', (req, res, next)=> {
	Vacancy.find()
	.populate('employer')
	.exec((err, vacancies)=> {
		if(err) return res.send(err)
		res.send(vacancies)
	})
})

router.get('/search/:page', (req, res, next)=>{
 	Vacancy.find().skip((req.params.page - 1) * 5)
 		.limit(5)
 		.exec((err, vacancies)=>{
 			if(err) return res.send(err);
 			Vacancy.countDocuments().exec((err, count)=>{
 				if(err) return res.send(err)
 				res.send({results: vacancies, count: count});
 			})
 			
 		})
})

router.get('/:id', (req, res, next)=> {
	Vacancy.findById(req.params.id)
	.populate('employer')
	.exec((err, vacancy)=> {
		if(err) return res.send(err)
		Skill.find({ vacancy: req.params.id })
		.exec((err, skills)=> {
			if(err) return res.send(err)
			Employer.findById(vacancy.employer)
			.exec((err, employer)=> {
				if(err) return res.send(err)
				res.send({vacancy: vacancy, skills: skills, users: employer.users })
			})
		})
	})
})

router.get('/search/:query', (req, res, next)=> {
	const myRexExp = new RegExp(`${req.params.query}`, 'i')
	Vacancy.find({ position: myRexExp })
	.limit(5)
	.exec((err, vacancies)=> {
		if(err) return res.send(err)
		res.send(vacancies)
	})
})

router.post('/responsed/:id', (req, res, next)=> {
	Vacancy.findById(req.params.id)
	.exec((err, vacancy)=> {
		vacancy.responses.push(req.body.user_id)
		vacancy.save((err, result)=> {
			if(err) return res.send(err)
			Employer.findById(vacancy.employer)
			.exec((err, employer)=> {
				console.log(employer.invited)
				if(err) return res.send(err)
				console.log(req.body.cv_id)
				employer.invited.push(req.body.cv_id)
				console.log(employer.invited)
				employer.save((err, employer)=> {
					if(err) return res.send(err)
					User.find({employer: employer._id})
					.exec((err, users)=> {
						if(err) return res.send(err)
						User.findById(req.body.user_id)
						.exec((err, responsed_user)=> {
							if(err) return res.send(err)
							let addresses = [];
							for(var i = 0; i < users.length; i++){
								addresses[i] = {
						        from: '"HeadHunter.kz - Replica" <172.3itstep2017@gmail.com>', 
						        to: users[i].email, 
						        subject: 'Отклик на размещенную вакансию', 
						        html: `<p>Здравствуйте, ${users[i].firstname} ${users[i].lastname}.</p>
						        	   <p>На размещенную Вами вакансию 
						        	   <a href="http://142.93.229.118:3002/vacancy/${vacancy._id}">${vacancy.position}</a> 
						        	   пришел отклик от ${responsed_user.firstname} ${responsed_user.lastname} с резюме
						        	   <a href="http://142.93.229.118:3002/cv/${req.body.cv_id}">${req.body.cv_position}.</a></p>`   
						    	}
						    	transporter.sendMail(addresses[i], (error, info)=> {
						    		if(err) return res.sendStatus(401).send(err)
						    	})
							}
							res.sendStatus(200)
						    
						})
					})
				})
				
			})
		})
	})
})

router.post('/:id', (req, res, next)=> {
	Employer.findById(req.params.id)
	.exec((err, employer)=> {
		if(err) return res.send(err)
		let skills = req.body.skills
		let vacancy = new Vacancy({
			position: req.body.position,
			salary: req.body.salary,
			xpLength: req.body.xpLength,
			workSchedule: req.body.workSchedule,
			requirements: req.body.requirements,
			preferable: req.body.preferable,
			conditions: req.body.conditions,
			employer: employer._id
		})

		vacancy.save((err, vacancy)=> {
			if(err) return res.send(err)
			employer.vacancies.push(vacancy._id)
			employer.save((err, employer)=> {
				if(err) return res.send(err)
				for(let i = 0; i < skills.length; i++){
					let skill = new Skill({
						skill: skills[i],
						vacancy: vacancy._id
					});
					skill.save((err, skill)=> {
						if(err) return res.send(err)
					})
				 }
				 res.send(vacancy)
				})
			})
		})			
	})	

router.delete('/:employer_id/:vacancy_id', (req, res, next)=>{
	Employer.findById(req.params.employer_id)
	.exec((err, employer)=> {
		if(err) return res.send(err)
		let updatedVacancies = employer.vacancies.filter((vacancy) => vacancy != req.params.vacancy_id)
		employer.vacancies = updatedVacancies
		employer.invited = []
		employer.save((err, result)=> {
			Vacancy.remove({_id: req.params.vacancy_id })
			.exec((err, result)=> {
				if(err) return res.send(err)
				res.sendStatus(200)
			})
		})
	})
})

router.put('/', (req, res, next)=> {
	Vacancy.findById(req.body._id)
	.exec((err, vacancy)=> {
		if(err) return res.send(err)
		vacancy.position = req.body.position
		vacancy.salary = req.body.salary
		vacancy.xpLength = req.body.xpLength
		vacancy.workSchedule = req.body.workSchedule
		vacancy.requirements = req.body.requirements
		vacancy.preferable = req.body.preferable
		vacancy.conditions = req.body.conditions
		vacancy.save((err, result)=> {
			Skill.find({ vacancy: req.body._id })
			.exec((err, skills)=> {
				if(err) return res.send(err)
				let skillsFromDb = [];
				for(let i = 0; i < skills.length; i++){
					skillsFromDb.push(skills[i].skill)
				}
				let uniqueSkills1 = skillsFromDb.filter((elem) => req.body.skills.indexOf(elem) === -1)
				let uniqueSkills2 = req.body.skills.filter((elem) => skillsFromDb.indexOf(elem) === -1)
				let newSkills = uniqueSkills1.concat(uniqueSkills2)

				for(var i = 0; i < newSkills.length; i++){
					let skill = new Skill({
						skill: newSkills[i],
						vacancy: req.body._id
					});
					skill.save((err, skill)=> {
						if(err) return res.send(err)
						res.sendStatus(200)
					})
				}

			})
		})	
	})
})






module.exports = router
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

const SENDER = '"HeadHunter.kz - Replica" <172.3itstep2017@gmail.com>';
const LOGO = '/images/hh_kz.png';
const LOCAL = 'localhost';
const REMOTE = '142.93.229.118';


router.get('/', (req, res, next)=> {
	Vacancy.find()
	.populate('employer')
	.exec((err, vacancies)=> {
		if(err) return res.send(err)
		res.send(vacancies)
	})
})

router.get('/view/:id', (req, res, next)=> {
	Vacancy.findById(req.params.id)
	.exec((err, vacancy)=> {
		if(err) return res.send(err)
		Employer.findById(vacancy.employer)
		.populate('users')
		.exec((err, employer)=> {
			if(err) return res.send(err)
			res.send({vacancy: vacancy, employer: employer })
		})
	})
})

router.get('/search/filters', (req, res, next)=> {
	if(req.query.salary != undefined && req.query.xp == undefined){
		Vacancy.find({ salary: req.query.salary })
		.sort({salary: req.query.salarysort})
		.skip((req.query.page - 1) * 5)
		.limit(5)
		.exec((err, vacancies)=> {
			if(err) return console.log(err)
			Vacancy.count({ salary: req.query.salary })
			.exec((err, count)=> {
				if(err) return console.log(err)
				res.send({results: vacancies, count: count})
			})
			
		})
	} else if(req.query.salary == undefined && req.query.xp != undefined){
		Vacancy.find({ xpLength: req.query.xp })
		.sort({salary: req.query.salarysort})
		.skip((req.query.page - 1) * 5)
		.limit(5)
		.exec((err, vacancies)=> {
			if(err) return console.log(err)
			Vacancy.count({ xpLength: req.query.xp })
			.exec((err, count)=> {
				if(err) return console.log(err)
				res.send({results: vacancies, count: count})
			})
			
		})
	} else if(req.query.salary == undefined && req.query.xp == undefined){
		Vacancy.find()
		.sort({salary: req.query.salarysort})
		.skip((req.query.page - 1) * 5)
		.limit(5)
		.exec((err, vacancies)=> {
			if(err) return console.log(err)
			Vacancy.count()
			.exec((err, count)=> {
				if(err) return console.log(err)
				res.send({results: vacancies, count: count})
			})
			
		})
	} else if(req.query.salary != undefined && req.query.xp != undefined){
		Vacancy.find({ salary: req.query.salary, xpLength: req.query.xp })
		.sort({salary: req.query.salarysort})
		.skip((req.query.page - 1) * 5)
		.limit(5)
		.exec((err, vacancies)=> {
			if(err) return console.log(err)
			Vacancy.count({ salary: req.query.salary, xpLength: req.query.xp })
			.exec((err, count)=> {
				if(err) return console.log(err)
				res.send({results: vacancies, count: count})
			})
			
		})
	}
})

router.get('/search/:page', (req, res, next)=>{
 	Vacancy.find()
 	.skip((req.params.page - 1) * 5)
	.limit(5)
	.exec((err, vacancies)=>{
		if(err) return res.send(err);
		Vacancy.count().exec((err, count)=>{
			if(err) return res.send(err)
			res.send({results: vacancies, count: count});
		})
		
	})
})

router.get('/search/common/:query', (req, res, next)=> {
	const myRexExp = new RegExp(`${req.params.query}`, 'i')
	Vacancy.find({ position: myRexExp })
	.limit(5)
	.exec((err, vacancies)=> {
		if(err) return res.send(err)
		res.send(vacancies)
	})
})

router.post('/responsed', (req, res, next)=> {
	Vacancy.findById(req.body.vacancy_id)
	.exec((err, vacancy)=> {
		vacancy.responses.push({
			cv_id: req.body.cv_id,
			employee_firstname: req.body.employee_firstname,
			employee_lastname: req.body.employee_lastname
		})
		vacancy.save((err, vacancy)=> {
			if(err) return res.send(err)
			User.find({employer: req.body.employer_id})
			.exec((err, managers)=> {
				if(err) return res.send(err)
				let managersEmails = [];
				
				for(var i = 0; i < managers.length; i++){
					managersEmails[i] = {
				        from: SENDER, 
				        to: managers[i].email, 
				        subject: 'Отклик на размещенную вакансию', 
				        html: `<img style="width: 150px; display: block; margin: 0 auto;" src="cid:${managers[i].email}">
				               <p style="font-size: 16px;">Здравствуйте, ${managers[i].firstname},</p>
				        	   <p style="font-size: 16px;">на размещенную Вами вакансию 
				        	   <a href="http://${LOCAL}:3002/vacancy/${vacancy._id}">${vacancy.position}</a> 
				        	   пришел отклик от ${req.body.employee_firstname} ${req.body.employee_lastname} c резюме ${req.body.cv_position}.</p>
				        	   <div style="display: block;
				        	        width: 150px;
				        	        text-align: center;
				        	        margin: 10px auto;
				        	        background-color: cornflowerblue;
				        	        border-radius: 3px;
				        	        padding: 10px 15px;">
    	                        <a style="text-decoration: none;
    	                           font-size: 18px; color: white;"
    	                           href="http://${LOCAL}:3002/cv/${req.body.cv_id}">Посмотреть</a>
    	                       </div>`
				        	   ,
				        attachments: [
				        	{
				        		filename: 'hh_kz.png',
				        		path: 'public' + LOGO,
				        		cid: managers[i].email
				        	}
				        ]   
			    	}
			    	
			    	transporter.sendMail(managersEmails[i], (error, info)=> {
			    		if(err) return res.sendStatus(401)
			    	})
				}
				res.sendStatus(200)
			})
				
			
			
		})
				
	})
})

router.post('/addvacancy', (req, res, next)=> {

	let vacancy = new Vacancy({
		position: req.body.position,
		salary: req.body.salary,
		xpLength: req.body.xpLength,
		workSchedule: req.body.workSchedule,
		requirements: req.body.requirements,
		preferable: req.body.preferable,
		conditions: req.body.conditions,
		employer: req.body.employer_id,
		employer_name: req.body.employer_name,
		skills: req.body.skills
	})	

	vacancy.save((err, vacancy)=> {
		if(err) return res.send(err)
		let skills = []
		for(let i = 0; i < vacancy.skills.length; i++){
			skills.push({name: vacancy.skills[i]})
		}
		Skill.insertMany(skills, (err, result)=> {
			if(err) res.send(err)
			res.sendStatus(200)
		})
	})			
})	

router.delete('/deleting/:vacancy_id', (req, res, next)=>{
	Vacancy.remove({_id: req.params.vacancy_id })
	.exec((err, result)=> {
		if(err) return res.send(err)
		res.sendStatus(200)
	})
})

router.put('/editing', (req, res, next)=> {
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
		vacancy.skills = req.body.skills

		vacancy.save((err, result)=> {
			if(err) return res.send(err)
			res.sendStatus(200)
		})	
	})
})



module.exports = router
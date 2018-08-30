const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')

const User = require('../models/User')
const CV = require('../models/CV')
const Skill = require('../models/Skill')
const Employer = require('../models/Employer')


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
	CV.find()
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		res.send(cvs)
	})
})

router.get('/user/:id', (req, res, next)=> {
	CV.find({user: req.params.id })
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		res.send(cvs)
	})
})

router.get('/salaries', (req, res, next)=> {
	CV.find()
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		let salaries = [];
		for(let i = 0; i < cvs.length; i++){
			salaries[i] = cvs[i].salary;
		}
		res.send(salaries);
	})
})

router.get('/search/:page', (req, res, next)=>{
 	CV.find().skip((req.params.page - 1) * 5)
 		.limit(5)
 		.exec((err, cvs)=>{
 			if(err) return res.send(err);
 			CV.countDocuments().exec((err, count)=>{
 				if(err) return res.send(err)
 				res.send({results: cvs, count: count});
 			})
 			
 		})
})

router.get('/:id', (req, res, next)=> {
	CV.findById(req.params.id)
	.exec((err, cv)=> {
		if(err) return res.send(err)
		Skill.find({ cv: req.params.id })
		.exec((err, skills)=> {
			if(err) return res.send(err)
			res.send({ cv: cv, skills: skills })
		})
	})
})

router.get('/user/:id', (req, res, next)=> {
	CV.find({ user: req.params.id })
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		res.send(cvs)
	})
})

router.get('/search/common/:query', (req, res, next)=> {
	const myRexExp = new RegExp(`${req.params.query}`, 'i')
	CV.find({ position: myRexExp })
	.limit(5)
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		res.send(cvs)
	})
})


router.post('/file/:id', upload.single('file'), (req, res, next)=>{
	User.findById(req.params.id).exec((err, user)=> {
		if(err) return res.send(err)

		let cv = new CV({
			position: req.body.position,
			salary: req.body.salary,
			birthDate: req.body.birthDate,
			gender: req.body.gender,
			citizenship: req.body.citizenship,
			address: req.body.address,
			phone: req.body.phone,
			specialization: req.body.specialization,
			xpLength: req.body.xpLength,
			education: req.body.education,
			courses: req.body.courses,
			work: req.body.work,
			user: user._id
		})

		let skills = req.body.skills.split(',');

		let tempPath = path.resolve(req.file.path);
		let targetPath = path.resolve(__dirname, `../../public/uploads/${cv._id}.${req.file.originalname.split('.').pop()}`);

		fs.rename(tempPath, targetPath, (err)=> {
			if(err) return res.send(err)
			cv.link = `/uploads/${cv._id}.${req.file.originalname.split('.').pop()}`;
			cv.save((err, cv)=>{
				if(err) return res.send(err)
				user.cv.push(cv._id)
				user.save((err, user)=> {
					if(err) return res.send(err)
					for(var i = 0; i < skills.length; i++){
						let skill = new Skill({
							skill: skills[i],
							cv: cv._id
						})
						skill.save((err, skill)=> {
							if(err) return res.send(err)
						})
					}
					res.sendStatus(200).end(cv)
				})
			})
		})
	})
})

router.post('/:id', (req, res, next)=>{
	User.findById(req.params.id).exec((err, user)=> {
		if(err) return res.send(err)

		let cv = new CV({
			position: req.body.position,
			salary: req.body.salary,
			birthDate: req.body.birthDate,
			gender: req.body.gender,
			citizenship: req.body.citizenship,
			address: req.body.address,
			phone: req.body.phone,
			specialization: req.body.specialization,
			xpLength: req.body.xpLength,
			education: req.body.education,
			courses: req.body.courses,
			work: req.body.work,
			user: user._id
		})

		let skills = req.body.skills;

		cv.save((err, cv)=>{
			if(err) return res.send(err)
			user.cv.push(cv._id)
			user.save((err, user)=> {
				if(err) return res.send(err)
				for(var i = 0; i < skills.length; i++){
					let skill = new Skill({
						skill: skills[i],
						cv: cv._id
					})
					skill.save((err, skill)=> {
						if(err) return res.send(err)
					})
				}
				res.send(cv)
			})
		})
	})
})


router.post('/responsed/:id', (req, res, next)=> {
	CV.findById(req.params.id)
	.exec((err, cv)=> {
		if(err) return res.send(err)
		cv.responses.push(req.body.employer_id)
		cv.save((err, result)=> {
			if(err) return res.send(err)
			Employer.findById(req.body.employer_id)
			.exec((err, employer)=> {
				employer.invited.push(req.params.id)
				employer.save((err, success)=> {
					if(err) return res.send(err)
					User.findById(cv.user)
					.exec((err, user)=> {
					if (err) return res.send(err)
					let mailOptions = {
				        from: SENDER, 
				        to: user.email, 
				        subject: 'Приглашение на собеседование', 
				        html: `<img style="width: 150px; display: block; margin: 0 auto;" src="cid:${user.email}">
				               <p style="font-size: 16px;">
				                Здравствуйте, ${user.firstname}, Ваше резюме 
				                <a style="font-size: 16px;" href="http://${LOCAL}:3002/cv/${cv._id}">${cv.position}</a>
				                заинтересовало работодателя.</p>
				        	   <p style="font-size: 16px;">Компания ${employer.name} пригласила Вас на собеседование.</p>
				        	   <div 
				        	      style="display: block;
				        	             text-align: center;
				        	             width: 150px;
				        	             margin: 10px auto;
				        	             background-color: cornflowerblue;
				        	             border-radius: 3px;
				        	             padding: 10px 15px;">
		        	            <a style="color: white; text-decoration: none; font-size: 18px;" href="http://${LOCAL}:3002/employer/${employer._id}">
		        	             Посмотреть
		        	            </a>      
		        	           </div>`,
		        	     attachments: [
				        	{
				        		filename: 'hh_kz.png',
				        		path: 'public' + LOGO,
				        		cid: user.email
				        	}
				        ] 
				    }

				    transporter.sendMail(mailOptions, (error, info)=> {
				    	if(err) return res.sendStatus(401).send(err)
				    	res.sendStatus(200)
				    	})
					})
				})
			})
		})
	})
})

router.delete('/:user_id/:cv_id', (req, res, next)=>{
	User.findById(req.params.user_id)
	.exec((err, user)=> {
		if(err) return res.send(err)
		user.cv.filter((id) => id != req.params.cv_id)
		user.save((err, result)=> {
			CV.remove({_id: req.params.cv_id })
			.exec((err, result)=> {
				if(err) return res.send(err)
				res.sendStatus(200)
			})
		})
	})
})

router.put('/', (req, res, next)=> {
	CV.findById(req.body._id)
	.exec((err, cv)=> {
		if(err) return res.send(err)
		cv.position = req.body.position
		cv.salary = req.body.salary
		cv.birthDate = req.body.birthDate
		cv.address = req.body.address
		cv.citizenship = req.body.citizenship
		cv.gender = req.body.gender
		cv.education = req.body.education
		cv.specialization = req.body.specialization
		cv.work = req.body.work
		cv.courses = req.body.courses
		cv.xpLength = req.body.xpLength
		cv.save((err, result)=> {
			Skill.find({ cv: req.body._id })
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
						cv: req.body._id
					});
					skill.save((err, skill)=> {
						if(err) return res.send(err)
					})
				}
				res.sendStatus(200)
			})
		})	
	})
})


router.delete('/response/:cv_id/:employer_id', (req, res, next)=> {
	CV.findById(req.params.cv_id)
	.exec((err, cv)=> {
		if(err) return res.send(err)
		let index = cv.responses.indexOf(req.params.employer_id)
		cv.responses.splice(index, 1)
		cv.save((err, cv)=> {
			if(err) return res.send(err)
			res.sendStatus(200)
		})
	})
})




module.exports = router
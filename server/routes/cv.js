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

router.get('/:id', (req, res, next)=> {
	CV.find({user: req.params.id})
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		res.send(cvs)
	})
})

router.get('/view/:cv_id/:user_id', (req, res, next)=> {
	if(req.params.user_id != 1){
		CV.findById(req.params.cv_id).exec((err, cv)=> {
			if(err) return res.send(err)
			User.findById(req.params.user_id)
			.exec((err, user)=> {
				if(err) return res.send(err)
				if(user.employerAccess){
					Employer.findOne({ users: user._id }).exec((err, employer)=> {
						if(err) return res.send(err)
						cv.watches.push({
							employer_id: employer._id,
							employer_name: employer.name
						})
						cv.save((err, cv)=> {
							if(err) return res.send(err)
							res.send({ cv: cv, user: user })
						})
					})
				} else {
					res.send({ cv: cv, user: user })
				}
			})
		})
	}
	if(req.params.user_id == 1){
		CV.findById(req.params.cv_id)
		.exec((err, cv)=> {
			if(err) return res.send(err)
			res.send(cv)
		})
	}
})

router.get('/search/filters', (req, res, next)=> {
	console.log(0)
	if(req.query.salary != undefined && req.query.xp == undefined){
		console.log(1)
			CV.find({ salary: req.query.salary })
			.sort({salary: req.query.salarysort})
			.skip((req.query.page - 1) * 5)
			.limit(5)
			.exec((err, cvs)=> {
				if(err) return console.log(err)
				CV.count({ salary: req.query.salary })
				.exec((err, count)=> {
					if(err) return console.log(err)
					res.send({results: cvs, count: count})
				})
				
			})
		} else if(req.query.salary == undefined && req.query.xp != undefined){
			console.log(2)
			CV.find({ xpLength: req.query.xp })
			.sort({salary: req.query.salarysort})
			.skip((req.query.page - 1) * 5)
			.limit(5)
			.exec((err, cvs)=> {
				if(err) return console.log(err)
				CV.count({ xpLength: req.query.xp })
				.exec((err, count)=> {
					if(err) return console.log(err)
					res.send({results: cvs, count: count})
				})
				
			})
		} else if(req.query.salary == undefined && req.query.xp == undefined){
			console.log(3)
			CV.find()
			.sort({salary: req.query.salarysort})
			.skip((req.query.page - 1) * 5)
			.limit(5)
			.exec((err, cvs)=> {
				if(err) return console.log(err)
				CV.count()
				.exec((err, count)=> {
					if(err) return console.log(err)
					res.send({results: cvs, count: count})
				})
				
			})
		} else if(req.query.salary != undefined && req.query.xp != undefined){
			console.log(4)
			CV.find({ salary: req.query.salary, xpLength: req.query.xp })
			.sort({salary: req.query.salarysort})
			.skip((req.query.page - 1) * 5)
			.limit(5)
			.exec((err, cvs)=> {
				if(err) return console.log(err)
				CV.count({ salary: req.query.salary, xpLength: req.query.xp })
				.exec((err, count)=> {
					if(err) return console.log(err)
					res.send({results: cvs, count: count})
				})
				
			})
		}
})

router.get('/getcvs/:employee_id/:page', (req, res, next)=> {
	console.log(req.params, 1)
	CV.find({ user: req.params.employee_id })
	.skip((req.params.page - 1) * 5)
	.limit(5)
	.exec((err, cvspart)=> {
		if(err) return res.send(err)
		CV.count({user: req.params.employee_id})
		.exec((err, count)=> {
			if(err) return res.send(err)
			CV.find().exec((err, cvs)=> {
				if(err) return res.send(err)
				res.send({cvs: cvs, cvspart: cvspart, count: count})
			})
		})
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

router.get('/search/common/:query', (req, res, next)=> {
	const myRexExp = new RegExp(`${req.params.query}`, 'i')
	CV.find({ position: myRexExp })
	.limit(5)
	.exec((err, cvs)=> {
		if(err) return res.send(err)
		res.send(cvs)
	})
})

router.post('/addcv/withphoto', upload.single('file'), (req, res, next)=>{
	let skills = req.body.skills.split(',');

	let newcv = new CV({
		user: req.body.employee_id,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		phone: req.body.phone,
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
		skills: skills
	})

	let tempPath = path.resolve(req.file.path);
	let targetPath = path.resolve(__dirname, `../../public/uploads/${newcv._id}.${req.file.originalname.split('.').pop()}`);

	let skill = new Skill()

	fs.rename(tempPath, targetPath, (err)=> {
		if(err) return res.send(err)
		newcv.link = `/uploads/${cv._id}.${req.file.originalname.split('.').pop()}`;
		newcv.save((err, newcv)=>{
			if(err) return res.send(err)
			let skills = []
			for(let i = 0; i < newcv.skills.length; i++){
				skills.push({name: newcv.skills[i]})
			}
			Skill.insertMany(skills, (err, result)=> {
				if(err) res.send(err)
				res.sendStatus(200)
			})
		})
	})
})

router.post('/addcv', (req, res, next)=>{
	let newcv = new CV({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		phone: req.body.phone,
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
		user: req.body.employee_id,
		skills: req.body.skills
	})

	let skill = new Skill()

	newcv.save((err, newcv)=>{
		if(err) return res.send(err)
		let skills = []
		for(let i = 0; i < newcv.skills.length; i++){
			skills.push({name: newcv.skills[i]})
		}
		Skill.insertMany(skills, (err, result)=> {
			if(err) res.send(err)
			res.sendStatus(200)
		})
	})
})

router.post('/inviting', (req, res, next)=> {
	Employer.findById(req.body.employer_id).exec((err, employer)=> {
		if(err) return res.send(err)
		CV.findById(req.body.cv_id).exec((err, cv)=> {
			if(err) return res.send(err)
			cv.invites.push({
				employer_id: employer._id, 
				employer_name: employer.name
			})
			cv.save((err, cv)=> {
				if(err) return res.send(err)
				employer.invited.push({ 
					cv_id: cv._id,
					cv_position: cv.position, 
					employee_firstname: cv.firstname,
					employee_lastname: cv.lastname 
				})
				employer.save((err, employer)=> {
					if(err) return res.send(err)
					let mailOptions = {
				        from: SENDER, 
				        to: cv.email, 
				        subject: 'Приглашение на собеседование', 
				        html: `<img style="width: 150px; display: block; margin: 0 auto;" src="cid:${cv.email}">
				               <p style="font-size: 16px;">
				                Здравствуйте, ${cv.firstname}, Ваше резюме 
				                <a style="font-size: 16px;" href="http://${LOCAL}:3002/cv/view/${cv._id}">${cv.position}</a>
				                заинтересовало работодателя.</p>
				        	   <p style="font-size: 16px;">Компания ${employer.name} пригласила Вас на собеседование.</p>
				        	   <div style="display: block; text-align: center;
				        	             width: 150px; margin: 10px auto;
				        	             background-color: cornflowerblue;
				        	             border-radius: 3px; padding: 10px 15px;">
		        	            <a style="color: white; text-decoration: none; font-size: 18px;" href="http://${LOCAL}:3002/employer/${employer._id}">
		        	             Посмотреть
		        	            </a>      
		        	           </div>`,
		        	     attachments: [
				        	{
				        		filename: 'hh_kz.png',
				        		path: 'public' + LOGO,
				        		cid: cv.email
				        	}
				        ] 
				    }
				    
				    transporter.sendMail(mailOptions, (error, info)=> {
				    	if(err) return res.sendStatus(401)
				    	res.sendStatus(200)
					})
				})
			})
		})
	})
})

router.delete('/deleting/:user_id/:cv_id', (req, res, next)=>{
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

router.put('/editing', (req, res, next)=> {
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
		cv.skills = req.body.skills
		
		cv.save((err, cv)=> {
			if(err) return res.send(err)
			res.send(cv)
		})
	})
})


module.exports = router
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')
const path = require('path')

const User = require('../models/User')
const CV = require('../models/CV')


const redis = require('redis')
const editRedis = require('../edit')
const client = redis.createClient()
client.on('error', (err)=> console.log(`Error: ${err}`))

// router.get('/', (req, res, next)=> {
// 	CV.countDocuments().exec((err, count)=> {
// 		if(err) return res.send(err)
// 		res.send(count)
// 	})
// })

router.post('/:id', upload.single('file'), (req, res, next)=>{
	User.findById(req.params.id).exec((err, user)=> {
		if(err) return res.send(err)

		var cv = new CV({
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
			skills: req.body.skills,
		})

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
					res.send(cv)
					editRedis.edit(cv.user)
				})
			})
		})	
	})
})

// router.post('/:id', (req, res, next)=> {
// 	Employee.findById(req.params.id).exec((err, employee)=> {
// 		if(err) return res.send(err)
// 		var cv = new CV({
			
// 		})
// 		cv.save((err, cv)=> {
// 			if(err) return res.send(err)
// 			employee.cv.push(cv._id)
// 			employee.save((err, employee)=> {
// 				if(err) return res.send(err)
// 				res.send(cv)
// 				editRedis.edit(cv.employee)
// 			})
// 		})
// 	})	
// })



module.exports = router
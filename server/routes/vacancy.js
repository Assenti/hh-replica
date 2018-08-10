const express = require('express')
const router = express.Router()

const Employer = require('../models/Employer')
const User = require('../models/User')
const Vacancy = require('../models/Vacancy')

const redis = require('redis')
const editRedis = require('../edit')
const client = redis.createClient()
client.on('error', (err)=> console.log(`Error: ${err}`))


// END POINTS

router.post('/:id', (req, res, next)=> {
	Employer.findById(req.params.id).exec((err, employer)=> {
		if(err) return res.send(err)
		var vacancy = new Vacancy({
			position: req.body.position,
			xpLength: req.body.xpLength,
			workSchedule: req.body.workSchedule,
			requirements: req.body.requirements,
			preferable: req.body.preferable,
			conditions: req.body.conditions
		})
		vacancy.save((err, vacancy)=> {
			if(err) return res.send(err)
			employer.vacancies.push(vacancy._id)
			employer.save((err, employer)=> {
				if(err) return res.send(err)
				res.send(vacancy)
				editRedis.edit(vacancy.employer)
			})
		})
	})	
})

// router.delete('/:comment_id/:post_id', (req, res, next)=>{
// 	Comment.remove({_id: req.params.comment_id})
// 	.exec((err, result)=> {
// 		if(err) return res.send(err)
// 		Post.findById(req.params.post_id)
// 		.exec((err, post)=>{
// 			if(err) return res.send(err)
// 			post.comments = post.comments.filter((comment) => comment != req.params.comment_id)
// 			post.save((err, post)=> {
// 				if(err) return res.send(err)
// 				res.sendStatus(200)
// 				editRedis.edit(post)
// 			})
// 		})
// 	})
// })

// router.put('/', (req, res, next)=> {
// 	Comment.findById(req.body._id)
// 	.exec((err, comment)=> {
// 		if(err) return res.send(err)
// 		else {
// 			comment.body = req.body.body;
// 			comment.save((err, result)=> {
// 				if(err) return res.send(err)
// 				res.sendStatus(200)
// 				editRedis.edit(comment.post)
// 			})
// 		}	
// 	})
// })






module.exports = router
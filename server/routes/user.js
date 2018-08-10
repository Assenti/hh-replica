const express = require('express')
const router = express.Router()
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const nodemailer = require('nodemailer')

const User = require('../models/User')
const CV = require('../models/CV')
const Employer = require('../models/Employer')
const Vacancy = require('../models/Vacancy')

const redis = require('redis')
const editRedis = require('../edit')
const client = redis.createClient()
client.on('error', (err)=> console.log(`Error: ${err}`))


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: '172.3itstep2017@gmail.com', 
        pass: 'fsnihgdmbxfwhptq' 
    }
});


// Saving in session
passport.serializeUser((user, next)=> {
	return next(null, user._id)
})

// Reading data about user
passport.deserializeUser((id, next)=> {
	User.findById(id).exec((err, user)=> {
		return next(err, user)
	})
})

// Including & Configuring Middlewares
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, next)=> {
	User.findOne({email: email, accepted: true})
	.exec((err, user)=> {
		if(err || !user) return next(err, null)
		user.comparePassword(password, (err, isEqual)=> {
			if(err) return next(err, null)
			if(isEqual) return next(null, user)
			return next(null, false)
		})
	})
}))

router.use(passport.initialize())
router.use(passport.session())

// END POINTS

router.get('/', (req, res, next)=> {
	User.find().exec((err, users)=> {
		if(err) return res.send(err)
		res.send(users)
	})
})



router.get('/:id', (req, res, next)=>{
 	client.get(req.params.id, (err, employee)=> {
 		if(err) return res.send(err)
 		if(employee) {
 			res.send(JSON.parse(employee))
 		} else {
 			User.findById(req.params.id).populate('cv')
			.exec((err, employee)=>{
				if(err) return res.send(err);
					client.set(req.params.id, JSON.stringify(employee), redis.print)
					res.send(employee);
				})
 		}
 	})		
 })

router.post('/signup', (req, res, next)=> {
	let user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
		phone: req.body.phone,
		employerAccess: req.body.employerAccess
	})

	user.save((err, user)=> {
		if(err) res.send(err)
		let mailOptions = {
	        from: '"HeadHunter.kz - Replica" <172.3itstep2017@gmail.com>', 
	        to: user.email, 
	        subject: 'Sign Up Confirmation', 
	        html: `<p>Hello Mr.${user.lastname}. Please finish your registration on HeadHunter.kz - Replica.</p><a href="http://localhost:3000/api/user/accept/${user._id}">Please move to link</a>` 
	    }

	    transporter.sendMail(mailOptions, (error, info)=> {
	    	if(err) return res.sendStatus(401).send(err)
	    	res.sendStatus(200)
	    })
	})

})

// Email confirmation End Point
router.get('/accept/:id', (req, res, next)=>{
 	User.findById(req.params.id)
 		.exec((err, user)=>{
 			if(err) return res.send(err);
 			user.accepted = true;
 			user.save((err, user)=>{
				if(err) return res.send(err)
				res.redirect('/user/signin')
			})
 			
 		})
})

router.post('/signin', passport.authenticate('local'), (req, res, next)=> {
	res.cookie('session', JSON.stringify(req.user))
	res.send(req.user)
})

router.post('/signout', (req, res, next)=> {
	res.clearCookie('session')
	res.sendStatus(200)
})


module.exports = router
const express = require('express')
const router = express.Router()
const path = require('path')
const Joi = require('joi')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const nodemailer = require('nodemailer')

const Employee = require('../models/Employee')
const CV = require('../models/CV')


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '172.3itstep2017@gmail.com', // generated ethereal user
        pass: 'fsnihgdmbxfwhptq' // generated ethereal password
    }
});


// Including & Configuring Middlewares
router.use(passport.initialize())
router.use(passport.session())
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, next)=> {
	Employee.findOne({email: email, accepted: true})
	.exec((err, employee)=> {
		if(err || !employee) return next(err, null)
		employee.comparePassword(password, (err, isEqual)=> {
			if(err) return next(err, null)
			if(isEqual) return next(null, employee)
			return next(null, false)
		})
	})
}))

// Saving in session
passport.serializeUser((employee, next)=> {
	return next(null, employee._id)
})

// Reading data about employee
passport.deserializeUser((id, next)=> {
	Employee.findById(id).exec((err, employee)=> {
		return next(err, employee)
	})
})



// END POINTS

router.post('/employee/signup', (req, res, next)=> {
	const schema = {
		password: Joi.string().min(3).required()
	}

	const { error } = Joi.validate(req.body, schema)
	if(error) return res.sendStatus(400).send(error)

	let employee = new Employee({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password
	})

	employee.save((err, employee)=> {
		if(err) res.send(err)
		let mailOptions = {
	        from: '"HeadHunter.kz - Replica" <172.3itstep2017@gmail.com>', 
	        to: employee.email, 
	        subject: 'Sign Up Confirmation', 
	        html: `<p>Hello Mr.${employee.lastname}. Please finish your registration on HeadHunter.kz - Replica.</p><a href="http://localhost:3000/api/employee/accept/${employee._id}">Please move to link</a>` 
	    }

	    transporter.sendMail(mailOptions, (error, info)=> {
	    	if(err) return res.sendStatus(401).send(err)
	    	res.sendStatus(200)
	    })
	})

})

router.get('/employee/accept/:id', (req, res, next)=>{
 	User.findById(req.params.id)
 		.exec((err, user)=>{
 			if(err) return res.send(err);
 			user.accepted = true;
 			user.save((err, user)=>{
				if(err) return res.send(err)
				res.redirect('/employee/signin')
			})
 			
 		})
})

router.post('/employee/signin', passport.authenticate('local'), (req, res, next)=> {
	res.cookie('session', JSON.stringify(req.user))
	res.send(req.user)
})

router.post('/employee/signout', (req, res, next)=> {
	res.clearCookie('session')
	res.sendStatus(200)
})


module.exports = router
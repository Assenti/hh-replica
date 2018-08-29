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
	User.find().populate('cv')
		.exec((err, users)=> {
		if(err) return res.send(err)
		res.send(users)
	})
})

router.get('/:id', (req, res, next)=>{
	User.findById(req.params.id).populate('cv')
	.exec((err, user)=>{
		if(err) return res.send(err);
		res.send(user);
		})
	}

 )

router.get('/account/:id', (req, res, next)=>{
	User.findById(req.params.id)
	.exec((err, user)=>{
		if(err) return res.send(err);
		res.send(user);
		})
	}

 )

router.post('/account', (req, res, next)=> {
	User.findById(req.body._id)
	.exec((err, user)=> {
		if(err) return res.send(err)
		user.firstname = req.body.firstname
		user.lastname = req.body.lastname
		user.phone = req.body.phone
		user.save((err, result)=> {
			if(err) return res.send(err)
			res.sendStatus(200)
		})
	})
})

router.delete('/account/:id', (req, res, next)=> {
	CV.remove({ user: req.params.id })
	.exec((err, result)=> {
		if(err) return res.send(err)
		User.findById(req.params.id)
		.exec((err, user)=> {
			if(err) return res.send(err)
			Employer.findById(user.employer)
			.exec((err, employer)=> {
				let updatedReps = employer.users.filter((user) => user != req.params.id)
				employer.save((err, savedEmployer)=> {
					if(err) return res.send(err)
					User.remove({_id: req.params.id })
					.exec((err, deletetationResult)=> {
						if(err) return res.send(err)
						res.redirect('/signout')
					})
				})
			})
		}) 

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

	let employer = new Employer({
		name: req.body.name,
		site: req.body.site,
		employeesQuantity: req.body.employeesQuantity,
		city: req.body.city
	})

	if(req.body.employerAccess){
		employer.save((err, employer)=> {
		if(err) return res.send(err)
		user.employer = employer._id
		user.save((err, user)=> {
			if(err) res.send(err)
			employer.users.push(user._id)
			employer.save((err, employer)=> {
				if(err) return res.send(err)
				let mailOptions = {
			        from: SENDER, 
			        to: user.email, 
			        subject: 'Подтверждение регистрации', 
			        html: `<img style="width: 150px; display: block; margin: 0 auto;" src="cid:${user.email}">
			        	   <p style="font-size: 16px;">
			        	    Здравствуйте ${user.firstname},пожалуйста активируйте Ваш аккаунт на HeadHunter.kz - Replica.
			        	   </p>
			        	   <div style="display: block;
			        	   		width: 150px;
			        	        margin: 10px auto;
			        	        background-color: cornflowerblue;
			        	        border-radius: 3px;
			        	        padding: 10px 15px;">
		        	        <a style="color: white; 
		        	           font-size: 16px;" 
		        	           href="http://${LOCAL}:3002/api/user/accept/${user._id}">Активировать</a>
		        	       </div>` ,
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
	} else {
		user.save((err, user)=> {
			if(err) res.send(err)
			let mailOptions = {
		        from: SENDER, 
		        to: user.email, 
		        subject: 'Подтверждение регистрации', 
		        html: `<img style="width: 150px; display: block; margin: 0 auto;" src="cid:${user.email}">
		        	   <p style="font-size: 16px;">
		        	    Здравствуйте ${user.firstname},пожалуйста активируйте Ваш аккаунт на HeadHunter.kz - Replica.
		        	   </p>
		        	   <div style="display: block;
		        	   		width: 150px;
		        	        margin: 10px auto;
		        	        background-color: cornflowerblue;
		        	        border-radius: 3px;
		        	        padding: 10px 15px;">
	        	        <a style="color: white; 
	        	           font-size: 16px;" 
	        	           href="http://${LOCAL}:3002/api/user/accept/${user._id}">Активировать</a>
	        	       </div>` ,
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
		}

})


router.post('/signup/manager/:id', (req, res, next)=> {
	let newUser = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
		phone: req.body.phone,
		employerAccess: req.body.employerAccess,
		employer: req.params.id
	})

	User.find({ employer: req.params.id })
	.exec((err, user)=> {
		if(err) return res.send(err)
		Employer.findById(req.params.id)
		.exec((err, employer)=> {
			if(err) return res.send(err)
			newUser.save((err, savedUser)=> {
				if(err) return res.send(err)
				
				let mailOptions = {
			        from: '"HeadHunter.kz - Replica" <172.3itstep2017@gmail.com>', 
			        to: newUser.email, 
			        subject: 'Подтверждение регистрации', 
			        html: `<p>Здравствуйте ${newUser.firstname} ${newUser.lastname}.
			        	 Пожалуйста закончите регистрацию на HeadHunter.kz - Replica пройдя по 
			        	  <a href="http://142.93.229.118:3002/api/user/accept/${newUser._id}">ссылке.</a></p>`  
			    }

			    transporter.sendMail(mailOptions, (error, info)=> {
			    	if(err) return res.sendStatus(401).send(err)
			    	if(employer.users.includes(user._id)){
			    		employer.users.push(savedUser._id)
			    	} else {
						employer.users.push(user._id, savedUser._id)			    		
			    	}
					employer.save((err, result)=> {
						if(err) return res.send(err)
						res.sendStatus(200)
						})
			    	})
				})

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
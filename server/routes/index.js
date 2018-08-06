const express = require('express')
const router = express.Router()



const Employee = require('../models/Employee')
const Employer = require('../models/Employer')



router.use('/employee', require('./employee'))
// router.use('/employer', require('./employer'))
// router.use('/cv', require('./cv'))
// router.use('/vacancy', require('./vacancy'))


module.exports = router
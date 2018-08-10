const express = require('express')
const router = express.Router()

router.use('/employer', require('./employer'))
router.use('/user', require('./user'))
router.use('/cv', require('./cv'))
router.use('/vacancy', require('./vacancy'))


module.exports = router
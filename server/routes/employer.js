const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')
const path = require('path')

const Employer = require('../models/Employer')
const Vacancy = require('../models/Vacancy')


module.exports = router
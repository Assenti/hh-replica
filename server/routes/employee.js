const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')
const path = require('path')

const Employee = require('../models/Employee')
const CV = require('../models/CV')


module.exports = router
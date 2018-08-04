const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({limit: '5mb'}))
app.use(cookieParser())
app.use(morgan('dev'))




app.listen(3000, ()=> {
	console.log('Server started on port 3000...')
})

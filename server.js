const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

mongoose.connect('mongodb://localhost:27017/hh-replica', { useNewUrlParser: true })

const app = express()

// Including & Configuring Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({limit: '5mb'}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(session({
	resave: true,
	secret: 'secret',
	saveUninitialized: true,
	key: 'key',
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use('/api', require('./server/routes'))

app.get('*', (req, res, next)=> {
	res.redirect('/#' + req.originalUrl)
})

const port = process.env.PORT || 3002

app.listen(port, ()=> {
	console.log(`Server listening on port ${port}...`)
})

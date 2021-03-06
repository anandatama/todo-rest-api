const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()

mongoose.connect('mongodb://localhost/todoapp', {useMongoClient: true})
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', require('./routes/index'))

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  if (err.name == 'CastError') {
    res.status(400).json({
      message: 'Please check parameter id'
    })
  } else {
    next(err)
  }
})

app.use(function(err, req, res, next) {
  if (err.isBoom) {
    console.log(err)
    res.status(err.output.statusCode).json({
      message: err.message
    })
  } else {
    next(err)
  }
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  console.log(err)
  res.json({
    message: err.message
  })
})

module.exports = app

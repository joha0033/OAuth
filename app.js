require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//database and connection
const mongoose = require('mongoose')
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/APIAuthentication');
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/APIAuthenticationTEST');
} else {
  mongoose.connect('mongodb://localhost/APIAuthentication');
}


// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}


//require route files
const Users = require('./routes/users.js')

//creates express app
const app = express()


// middleware, ran in squence
app.use(morgan('dev'))

app.use(bodyParser.json())


// routes
// http://localhost:3000/users... require >> /signup || /login
app.use('/users', Users)


module.exports = app

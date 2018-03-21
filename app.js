require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
const dbURL = 'mongodb://'+process.env.DATABASE_CRED+':'+process.env.DATABASE_CRED+'@ds121099.mlab.com:21099/'+process.env.DATABASE_NAME

// console.log(process.env.JWT_SECRET_ENV);
// console.log('dbURL', dbURL)
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/APIAuthenticationTEST');
} else {
  // mongoose.connect('mongodb://austin:austin@ds121099.mlab.com:21099/heroku_fwzsfljt');
  // mongoose.connect('mongodb://localhost/APIAuthentication');
  mongoose.connect(process.env.MONGOLAB_MAROON_URI || dbURL);
}


// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

//creates express app
const app = express()


app.use(bodyParser.json())


// routes
// http://localhost:3000/users... require >> /signup || /login
app.use('/users', require('./routes/users.js'))


module.exports = app

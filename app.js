require('dotenv').config();
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./configuration')
//ridiculous looking variable for database URL
const dbURL = 'mongodb://'+process.env.DATABASE_CRED+':'+process.env.DATABASE_CRED+'@ds121099.mlab.com:21099/'+process.env.DATABASE_NAME


mongoose.Promise = global.Promise;

//incase we're testing
if (process.env.NODE_ENV === 'test') {

  mongoose.connect('mongodb://localhost/APIAuthenticationTEST');

} else {
  //when we're not testing
  mongoose.connect(process.env.MONGOLAB_MAROON_URI || dbURL);

}


// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {

  app.use(morgan('dev'));

}

//creates express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


// routes
app.use('/users', require('./routes/users.js'))


module.exports = app

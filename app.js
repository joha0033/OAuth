const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//database and connection
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/APIAuthentication');


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




// start the server
// we need a port for the server
const port = process.env.PORT || 3000

app.listen(3000)

console.log(`server is jogging on ${port}`);

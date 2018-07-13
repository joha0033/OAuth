require('dotenv')
  .config()

const express = 
  require('express')

const app = 
  express()

const cors = 
  require('cors')

const morgan = 
  require('morgan')

const bodyParser = 
  require('body-parser')
const mongoose = 
  require('mongoose')

const config = 
  require('./configuration')
  
const dbURL = 
  'mongodb://'+process.env.DATABASE_CRED+':'+process.env.DATABASE_CRED+'@ds121099.mlab.com:21099/'+process.env.DATABASE_NAME

mongoose.Promise = 
  global.Promise

  // DATABASE CONNECTION
if (process.env.NODE_ENV === 'test' 
      || process.env.NODE_ENV === 'development' ) {
        mongoose
          .connect(
            'mongodb://localhost/APIAuthentication'
          )
} else {
  mongoose
    .connect(
        process.env.MONGOLAB_MAROON_URI || dbURL
    );
}

if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));

}

// MIDDLEWARE
app
  .use(
    cors()
  )

app
  .use(
    bodyParser
      .json()
  )

// HEADERS
app
  .all(
    '/*', 
    function(req, res, next) {
      res
        .header(
          'Access-Control-Allow-Origin', 
          '*'
        )
      res
        .header(
          'Access-Control-Allow-Headers',  
          'X-Requested-With'
        )
      next();
    });

// ROUTES
app
  .use(
    '/users', 
    require(
      './routes/users.js'
    )
  )

app
  .use(
    '/posts', 
    require(
      './routes/posts.js'
    )
  )

app
  .use(
    '/comments', 
    require(
      './routes/comments.js'
    )
  )

module.exports = app


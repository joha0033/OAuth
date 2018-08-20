
const express = 
  require('express');

const requestTo = 
  require('express-promise-router')();

const passport = 
  require('passport');

const passportConf = 
  require('../passport');

const { 
  validateBody, 
  schemas 
} = 
  require('../helpers/routeHelpers');

const UsersController = 
  require('../controllers/users_controller');

const passportSignIn = passport
  .authenticate(
    'local', 
    { 
      session: false
    }
  );

const passportJWT = passport
  .authenticate(
    'jwt', 
    { 
      session: false 
    }
  ); 

requestTo
  .route(
    '/getall'
  )
  .get(
    UsersController
      .getAll
  )

requestTo
  .route(
    '/signup'
  )
  .post(
    validateBody(
      schemas
        .registerSchema
    ),
    UsersController
      .signUp
  )

requestTo
  .route(
    '/signin'
  )
  .post(
    validateBody(
      schemas
        .authSchema
    ), 
    passportSignIn, 
    UsersController
      .signIn
  )

requestTo
  .route(
    '/oauth/google'
  )
  .post(
    passport
      .authenticate(
        'google-token', 
        { session: false }
      ), 
    UsersController 
      .googleOAuth
  )

requestTo
  .route(
    '/profile/'
  )
  .get(
    passportJWT, 
    UsersController
      .getProfile
  )


const multer = 
  require('multer')

var upload = 
  multer({ 
    dest: './uploads' 
  })

requestTo
  .route(
    '/profile/edit'
  )
  .put(
    // upload.single('bannerImage'),
    upload.fields([
      { name: 'bannerImage', maxCount: 1 },
      { name: 'profileImage', maxCount: 1 }
    ]),
    passportJWT,
    UsersController
      .editProfile
  )

requestTo
  .route(
    '/profile/posts'
  )
  .get(
    passportJWT, 
    UsersController
      .getUsersPost
  )

requestTo
  .route(
    '/profile/:username/posts/:postId'
  )
  .get(
    UsersController
      .getOnePost
  )

requestTo
  .route(
    '/profile/:username/posts/:postId/edit'
  )
  .put(
    UsersController
      .updateOnePost
  )

requestTo
  .route(
    '/profile/:username/posts/:postId/delete'
  )
  .delete(
    UsersController
      .deleteOnePost
  )

requestTo
  .route(
    '/oauth/facebook'
  )
  .post(
    passport
      .authenticate(
        'facebook-token', 
        { 
          session: false 
        }
      ), 
      UsersController
        .facebookOAuth
  )

requestTo
  .route(
    '/secret'
  )
  .get(
    passportJWT, 
    UsersController.secret
  )

requestTo
  .route(
    '/tokencheck'
  )
  .get(
    passportJWT, 
    UsersController.secret
  )

module.exports = requestTo;

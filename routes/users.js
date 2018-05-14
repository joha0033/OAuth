const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');


const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users_controller');


const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });


//signup, first time, not in db
router.route('/signup')
  .post(validateBody(schemas.registerSchema), UsersController.signUp);

// signin, because you're in the db and you know it
router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);



// Google+ route
router.route('/oauth/google')
  .post(passport.authenticate('google-token', { session: false }), UsersController.googleOAuth);



/////////////////////
// FACEBOOK ROUTES //
/////////////////////

if(process.env.NODE_ENV === 'development'){

  // FAKE FACEBOOK
  router.route('/oauth/facebook')
    .post(UsersController.FAKEfacebookOAuth);

} else {

  // Facebook Route
  router.route('/oauth/facebook')
    .post(passport.authenticate('facebook-token', { session: false }), UsersController.facebookOAuth);

}


//Access to secret resource if you have valid token
router.route('/secret')
  .get(passportJWT, UsersController.secret);

//secret#2
router.route('/tokencheck')
  .get(passportJWT, UsersController.secret)


module.exports = router;

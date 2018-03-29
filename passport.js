const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./configuration');
const User = require('./models/user');
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const dotenv = require('dotenv').config();
require('dotenv').config();


// JSON WEB TOKENS STRATEGY
passport.use('jwt', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.Jwt_Secret
}, async (payload, done) => {
  try {

    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // ready the cargo captain!
    let userAddToken = {
      userData: user,
      _id: payload.sub
    }

    // If user doesn't exists, handle it and get out.
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, userAddToken);

  } catch(error) {

    done(error, false);

  }
}));

// FACEBOOK Strategy
passport.use('facebook-token', new FacebookTokenStrategy({

  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret

}, async (accessToken, refreshToken, profile, done) => {

  try{

    //check if user has FB creds in db
    const existingUser = await User.findOne({'facebook.id': profile.id})

    // if so, leave.
    if(existingUser){
      return done(null, existingUser)
    }

    // if not, lets get you some.
    const newUser = new User({
      method: profile.provider,
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    // saving user to db
    await newUser.save()

    // send user
    done(null, newUser)

  }catch(error){

    done(error, false, error.message)

  }
}))

// GOOGLE Strategy
passport.use('google-token', new GooglePlusTokenStrategy({

  clientID: config.oauth.google.clientID,
  clientSecret: config.oauth.google.clientSecret

}, async (accessToken, refreshToken, profile, done) =>{

  const existingUser = await User.findOne({'google.id': profile.id})

  if(existingUser){
    return done(null, existingUser)
  }

  const newUser = new User({
    method: 'google',
    google: {
      id: profile.id,
      email: profile.emails[0].value
    }
  })

  try{

    await newUser.save()

    done(null, newUser);

  }catch(error){

    done(error, error.message)

  }
}))

// LOCAL STRATEGY
passport.use('local', new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {

  try {

    // check if user exists
    const user = await User.findOne({ "local.email": email });

    //  no user? out!
    if (!user) {
      return done(null, false);
    }

    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);

    // If not, you can leave.
    if (!isMatch) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);

  } catch(error) {

    done(error, false);

  }
}));

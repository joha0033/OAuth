const passport = 
  require('passport')

const JwtStrategy = 
  require('passport-jwt').Strategy

const { ExtractJwt } = 
  require('passport-jwt')

const LocalStrategy = 
  require('passport-local').Strategy

const config = 
  require('./configuration')

const User = 
  require('./models/user')

const GooglePlusTokenStrategy = 
  require('passport-google-plus-token')

const FacebookTokenStrategy = 
  require('passport-facebook-token')

const dotenv = 
  require('dotenv').config()

require('dotenv').config();


passport
  .use (
    'jwt', 
    new JwtStrategy ({
      jwtFromRequest: ExtractJwt
        .fromHeader( 'authorization' ),
      secretOrKey: config
        .Jwt_Secret
    }, async ( 
      payload, 
      done 
    ) => {
      let username = payload.username

      try {
        payload = { 
          ...payload, 
          found: await User
            .findOne({
              username
            })
        }
    
        done(null, payload);
      } catch (error) {
        done(error, false)
      }
    })
  )

passport
  .use(
    'facebook-token', 
    new FacebookTokenStrategy({
      clientID: config
        .oauth.facebook.clientID,
      clientSecret: config
        .oauth.facebook.clientSecret
    }, async (
      accessToken, 
      refreshToken, 
      profile, 
      done
    ) => {
      let firstName = profile.givenName
      let lastName = profile.familyName
      let email = profile.emails[0].value
      let id = profile.id

      try {
        const existingUser = await User
          .findOne({
            'facebook.id': profile.id
          })

        if( existingUser ){
          return done(
              null, 
              existingUser
            )
        }

        const newUser = new User({
          method: profile.provider,
          facebook: {
            id,
            firstName,
            lastName,
            email
          }
        })
        await newUser
          .save()

        done(
          null, 
          newUser
        )

      } catch( error ) {

        done(
          error, 
          false, 
          error
            .message
        )
      }   
    })
  )

passport
  .use(
    'google-token', 
    new GooglePlusTokenStrategy({
      clientID: config
        .oauth.google.clientID,
      clientSecret: config
        .oauth.google.clientSecret
    }, async (
      accessToken, 
      refreshToken, 
      profile, 
      done
    ) => {
      let email = profile.emails[0].value
      let id = profile.id
      
      try {
        const existingUser = await User
          .findOne({
            'google.id': profile.id
          })

        if( existingUser ){
          return done(
              null, 
              existingUser
            )
        }

        const newUser = new User({
          method: 'google',
          google: {
            id,
            email
          }
        })

        await newUser
          .save()

        done(null, newUser)
      } catch (error) {
        done(error, error.message)
      }
    }))

// LOCAL STRATEGY
passport
  .use(
    'local', 
    new LocalStrategy({
      usernameField: 'email',
    }, async (
      email, 
      password, 
      done ) => {
        try {
          const user = await User
            .findOne({ 
              email 
            })

          if( !user ) {
            return done( null, false )
          } 

          const isMatch = await user
            .isValidPassword(password)

          if( !isMatch ) {
            return done(null, false);
          }

          done( null, user )
          } catch ( error ) {
          done( error, false)
        }
      }
    )
  );

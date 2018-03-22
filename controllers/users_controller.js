const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { Jwt_Secret } = require('../configuration')

//generate Token
const signToken = (user) => {

  // respond with token
  console.log('signToken()/user:', user);
  return JWT.sign({
    iss: 'austin',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1 )
  }, Jwt_Secret)
}

module.exports = {
  test: (req, res, next) =>{
    res.status(200).json('hit!')
  },
  signUp: async (req, res, next) => {

    // save data
    
    const { email, password } = req.body

    // check if email already exists in DB
    const foundUser = await User.findOne({ "local.email" : email })

    //if the user exists, send status and err message
    if(foundUser){
      return res.status(403).json({error: "email already exists"})
    }

    // create a user object with imported schema
    const newUser = new User({
      method: 'local',
      local: {
        email: email,
        password: password
      }
    })

    // save user, hit them with a token!
    await newUser.save()
    const token = signToken(newUser)

    res.status(200).json({ token })

  },

  signIn: async (req, res, next) => {
    //just need to hit them with a token
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  secret: async (req, res, next) => {
    //I dont have a lot of secrets
    res.json({ secret: 'you hit secret' })
  },

  googleOAuth: async (req, res, next) => {
    // create token and lets go!
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  facebookOAuth: async (req, res, next) =>{
    // create token and lets go!
    const token = signToken(req.user)
    res.status(200).json({ token })
  }
}

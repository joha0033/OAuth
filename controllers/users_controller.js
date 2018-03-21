const JWT = require('jsonwebtoken')
const User = require('../models/user')

//generate Token
const signToken = (user) => {
  console.log('signToken():', user);
  // respond with token
  return JWT.sign({
    iss: 'austin',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1 )
  }, process.env.JWT_SECRET_ENV)
}

module.exports = {
  signUp: async (req, res, next) => {
    console.log(req.value.body);
    // save data
    const { email, password } = req.value.body

    // check if email already exists in DB
    const foundUser = await User.findOne({ "local.email" : email })
    console.log('foundUser', foundUser);
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
    await newUser.save()
    const token = signToken(newUser)
    res.status(200).json({ token })
  },
  signIn: async (req, res, next) => {

    //just need to generate token
    console.log('req.user',req.user);
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  secret: async (req, res, next) => {
    res.json({ secret: 'you hit secret' })
  },

  googleOAuth: async (req, res, next) => {
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  facebookOAuth: async (req, res, next) =>{
    console.log('req.user', req.user);
    const token = signToken(req.user)
    res.status(200).json({ token })
  }
}

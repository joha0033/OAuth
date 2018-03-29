const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { Jwt_Secret } = require('../configuration')

//generate Token
const signToken = (user) => {

  // respond with token
  return JWT.sign({
    iss: 'austin',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1 )
  }, Jwt_Secret)
}

module.exports = {
  testGET: (req, res, next) =>{
    res.status(200).json('hit! get')
  },
  testPOST: (req, res, next) =>{
    res.status(200).json('hit! post')
  },
  signUp: async (req, res, next) => {

    // save data
    const { email, password } = req.body

    if(process.env.NODE_ENV === 'development'){
      const deleteUser = await User.findOne({ "local.email" : email }).remove().exec()
    }
    // check if email already exists in DB
    const foundUser = await User.findOne({ "local.email" : email })

    //if the user exists, send status and err message

    if(foundUser){
      return res.status(403).json({error: 'email already exists'})
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
    // console.log(req.user);
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  secret: async (req, res, next) => {
    //regenerate token for user?
    const token = signToken(req.user)
    //I dont have a lot of secrets
    res.json({
      token: token,
      payload: req.user
    })
  },

  googleOAuth: async (req, res, next) => {
    // create token and lets go!
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  facebookOAuth: async (req, res, next) =>{
    // create token and lets go!
    const token = signToken(req.user)
    res.status(201).json({ token })
  },

  /////////////////////////////////
  // FAKE ROUTE ?? MOVE TO TESTS //
  /////////////////////////////////
  FAKEfacebookOAuth: async (req, res, next) => {
    console.log(req.body);
    // save data
    const { email, password } = req.body
    // delete email if it already exists in DB
    const deleteUsers = await User.find({'facebook.email': email}).remove().exec()
    const foundUser = await User.findOne({'facebook.email': email})

    //if the user exists, send status and err message
    if(foundUser){
      console.log('email already exists')
      return res.status(403).json({error: 'email already exists'})
    }

    // create a user object with imported schema
    const newUser = new User({
      method: 'facebook',
      facebook: {
        email: email,
        password: password
      }
    })

    // save user, hit them with a token!
    await newUser.save()

    const token = signToken(newUser)

    res.status(200).json({ token })
  }
}

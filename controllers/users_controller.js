

const JWT = require('jsonwebtoken')
const User = require('../models/user')
const Post = require('../models/post')
const { Jwt_Secret } = require('../configuration')
const { users } = require('./user_seeds')

//generate Token
const signToken = async (user) => {
  console.log('------------',user);
  
  let userFound = await User.find({_id: user})
  console.log('b',userFound)
  
  let {firstName, lastName, email } = userFound.local || 'N/A'
  // respond with token
  return JWT.sign({
    iss: 'austin',
    firstName,
    lastName,
    email,
    sub: userFound._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1 )
  }, Jwt_Secret)
}

module.exports = {
  seed: async (req, res, next) => {
    
    const seedUsers = (seeds) => {
      seeds.map((user)=>{
        let newUser = new User(user)
        newUser.save();
      })
    }

    return process.env.NODE_ENV !== 'production'  
    ? ( User.remove({}).exec(), 
        seedUsers(users), 
        res.json({msg: 'Database cleared and seeded!'}))
    : ( res.json({msg: 'Your environment is in Production, cannot kill & reseed'}) )
   
  },
  getAll: async (req, res, next) => {
    const users = await User.find({})
    // 
    
    res.send(users)
  },
  getProfile: async (req, res, next) => {
    
    const token = await signToken(req.user._id)
    //I dont have a lot of secrets

    let posts = await Post.find({"user_id": req.user._id}).populate('comments').exec()
    let payload = await User.findById(req.user._id)
    console.log('payload', payload);
    
    
    res.json({
      token: token,
      payload: {
        profile: req.user.userData.local,
        posts,
        _id: req.user._id
      }
    })
  },
  signUp: async (req, res, next) => {
    // save data
    const { firstName, lastName, email, password } = req.body

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
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }
    })
  
    
    // save user, hit them with a token!
    await newUser.save()
    
    const token = signToken(newUser)
    res.status(200).json({
      token,
      email: newUser.local.email,
      firstName: newUser.local.firstName,
      lastName: newUser.local.lastName
     })

  },
  signIn: async (req, res, next) => {

    const token = await signToken(req.user)

    console.log('114', token);
    
    const foundUser = await User.findOne({ "local.email" : req.user.local.email })
  
    let { firstName, lastName, email } = foundUser.local;
    let id = foundUser._id
    
    firstName === undefined ? firstName = "First name N/A, please update profile information" : null
    lastName === undefined ? lastName = "Last name N/A, please update profile information" : null
    
    res.status(200).json({
      id,
      firstName,
      lastName,
      email,
      token
     })
  },
  secret: async (req, res, next) => {
    const token = signToken(req.user)
    //I dont have a lot of secrets
    res.json({
      token: token,
      _id: req.user._id,
      payload: req.user.userData.local
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
    
    // save data
    const { email, password } = req.body
    // delete email if it already exists in DB
    const deleteUsers = await User.find({'facebook.email': email}).remove().exec()
    const foundUser = await User.findOne({'facebook.email': email})

    //if the user exists, send status and err message
    if(foundUser){
      
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

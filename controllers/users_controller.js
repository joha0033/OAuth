

const mongoose = require('mongoose')
const JWT = require('jsonwebtoken')
const User = require('../models/user')
const Post = require('../models/post')
const { Jwt_Secret } = require('../configuration')
const { users } = require('./seeds/user_seeds')

//generate Token
const signToken = async (username) => {
  
  // respond with token
  return JWT.sign({
    iss: 'austin',
    username,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1 )
  }, Jwt_Secret)
}

module.exports = {
  addUsernames: async (req, res, next) => {
    let users = await User.find({})
    // console.log(posts);
    users.map(async (user)=>{
      // console.log(user.local.email);
      let userEmail =  await User.find({"local.email": user.local.email})
      // console.log('userEmail', userEmail);
      const username = userEmail[0].local.email.split(/[@]/)[0]
      console.log('username', username);
      let updatedUser = await User.update({"local.email": user.local.email}, {username})
      console.log(updatedUser);
    })
    users = await User.find({})
    res.json(users)
  },
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
    : ( res.json({msg: `Your environment is in ${process.env.NODE_ENV}, cannot kill & reseed`}))
   
  },
  getAll: async (req, res, next) => {
    const users = await User.find({})

    res.send(users)
  },
  getProfile: async (req, res, next) => {
    const token = await signToken(req.params.username)

    let posts = await Post
      .find({"user_id": req.params.id})
      .populate({path: "comments", populate: {path: "user_id"}}).exec()

    let userData = await User.findOne({"username":req.params.username}).exec()
    let profile = { userData, posts}
    
    res.json({ profile })
    
  },
  editProfile: async (req, res, next) => {

    const token = await signToken(req.params.username)

    let userData = await User.findOneAndUpdate({"username": req.params.username}, {local: {...req.body}} ).exec()
    console.log('userData', userData);

    res.json({
      token,
      updatedData: userData,
      update: 'success'
     })
    
  },
  getUsersPost: async (req, res, next) => {
    let posts = await Post.find({"username": req.user.username}).populate('comments').exec()
    console.log(posts);

    res.json({
      posts
    })
    
  },
  getOnePost: async (req, res, next) => {
    let postId = req.params.postId
    let valid = mongoose.Types.ObjectId.isValid(postId)
    let post;
    valid ? (
      post = await Post.findById(postId).populate('comments').exec(),
      res.json({ post })) :
    res.json({
      msg: "sorry, the ID you're looking for doesn't seem to be valid"
    })

    
    
    
  },
  updateOnePost: async (req, res, next) => {
    let postId = req.params.postId
    let changes = JSON.stringify(req.body)
    
    let post = await Post.findOneAndUpdate({"_id": postId}, changes).exec()



    res.json({
      post
    })
  },
  deleteOnePost: async (req, res, next) =>{
    let deletedPost =   await Post.findOneAndRemove(req.params.postId).exec()
    console.log(deletedPost);
    res.json({
      msg: "deleted"
    })
    
  },
  signUp: async (req, res, next) => {
    // save data
    
    const { firstName, lastName, email, password } = req.body
    const username = req.body.email.split(/[@]/)[0]
    
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
      username,
      local: {
        firstName,
        lastName,
        email,
        password
      }
    })
  
    
    // save user, hit them with a token!
    await newUser.save()
    
    let userId = await User.find({"local.email": email}, "_id")

    const token = await signToken(userId[0]._id)
    console.log(newUser);
    
    
    res.status(200).json({
      token,
      username: newUser.username,
      firstName: newUser.local.firstName,
      lastName: newUser.local.lastName
     })

  },
  signIn: async (req, res, next) => {
    console.log('signin HIT?',req.user);
    
    const token = await signToken(req.user.username)
    
    const foundUser = await User.findOne({ "local.email" : req.user.local.email })
  
    let { firstName, lastName, email } = foundUser.local;
    let username = foundUser.username
    
    firstName === undefined ? firstName = "First name N/A, please update profile information" : null
    lastName === undefined ? lastName = "Last name N/A, please update profile information" : null
    
    res.status(200).json({
      username,
      // firstName,
      // lastName,
      // email,
      token
     })
  },
  secret: async (req, res, next) => {
    let userId = req.user.found._id;
    const token = await signToken(userId)
    
    res.json({
      token: token,
      _id: req.user._id,
      payload: req.user.found
    })
  },
  googleOAuth: async (req, res, next) => {
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  facebookOAuth: async (req, res, next) =>{
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

    let userId = await User.find({"local.email": email}, "id").exec()

    // console.log("userId", userId);

    const token = await signToken(userId[0]._id)

    res.status(200).json({ token })
  }
}

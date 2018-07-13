

const mongoose = 
  require('mongoose')

const JWT = 
  require('jsonwebtoken')

const User = 
  require('../models/user')

const Post = 
  require('../models/post')

const Comment = 
  require('../models/comment')

const { Jwt_Secret } = 
  require('../configuration')

const { userSeeds } = 
  require('./seeds/user_seeds')

const { postSeeds } = 
  require('./seeds/post_seeds')

const { commentSeeds } = 
  require('./seeds/comment_seeds')

const async = 
  require('async')
;

const signToken = async (username) => {
  return JWT.sign({
    iss: 'austin',
    username,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1 )
  }, Jwt_Secret)
}

module.exports = {
  getAll: async (req, res, next) => {
    let users = await User.find({}) // all
    let allUsersWithPosts = []
    
    users.map((user) => {
      let user_id = user.id
      Post.find({
        user_id
      }, (err, posts) => {
        user = { 
          ...user._doc, 
          posts
        }
        allUsersWithPosts.push(user)
      })
    }) 

    //  eww... i had to.
    setTimeout(() => {
      res.json(allUsersWithPosts)
    }, 200)
  },
  getProfile: async (req, res, next) => {
    let { username } = req.params
    let user = await User
      .findOne({
       username
      })
    
    let user_id = user._id
    let posts = await Post
      .find({
       user_id
      })
      .populate({
        path: 'comments', 
        populate: {
          path: 'user_id'
        }
      })

    let usersProfile = { 
      ...user._doc, 
      posts
    }

    res.json(usersProfile)
  },
  editProfile: async (req, res, next) => {
    let { username } = req.params
    let { password } = req.body
    const token = await 
      signToken(username)
    
    let userData = await User
      .findOneAndUpdate({ 
        username 
      }, { //change
        password, 
        ...req.body 
      }).exec()

    res.json({
      token,
      updatedData: userData,
      update: 'success'
     })
    
  },
  getUsersPost: async (req, res, next) => {
    let { username } = req.user
    let posts = await Post
      .find({
        username
      })
      .populate('comments')
      .exec()

    res.json({
      posts
    })
    
  },
  getOnePost: async (req, res, next) => {
    let { postId } = req.params
    let { isValid } = mongoose.Types.ObjectId
    let post;

    isValid(postId) // 
      ? post = await Post
          .findById(postId)
          .populate('comments')
      : res.json({
          msg: 'sorry, the ID you\'re using doesn\'t seem to be valid'
        }) 
    
    res.json({ 
      post 
    })
  },
  updateOnePost: async (req, res, next) => {
    let id = req.params.postId
    let changes = JSON.stringify(req.body)

    let post = await Post
      .findByIdAndUpdate({
          id
        }, 
        changes
      )

    res.json({
      post
    })
  },
  deleteOnePost: async (req, res, next) =>{
    let deletedPost = await Post
      .findOneAndRemove(
        req.params.postId
      )

    res.json({
      msg: 'deleted'
    })
  },
  signUp: async (req, res, next) => {
    const { 
        firstName, 
        lastName, 
        email, 
        password 
      } = req.body
    const username = req.body
      .email.split(/[@]/)[0]
    const updateMsg = 'N/A, please update profile information'

    firstName === undefined 
      ? firstName = updateMsg 
      : null
    lastName === undefined 
      ? lastName = updateMsg 
      : null
  
    if(process.env.NODE_ENV === 'development'){
      await User
        .findOne({ 
          email 
        })
        .remove()
    }

    const userExisits = await User
      .findOne({ 
        email 
      })

    if(!!userExisits){
      return res.status(403)
        .json({
          error: 'email already exists'
        })
    }
    
    const newUser = new User({
      method: 'local',
      username,
      firstName,
      lastName,
      email,
      password,
    })
  
    await newUser.save()
    
    let userId = await User
      .find({
        email
      }, 
      "_id")

    const token = await 
      signToken(username)
    
    res.status(200).json({ 
      ...newUser._doc, 
      token 
    })
  },
  signIn: async (req, res, next) => {
    const { 
      username,
    } = req.user

    const token = await 
      signToken(username)
  
    res.status(200).json({
      username,
      token
     })
  },
  secret: async (req, res, next) => {
    let { username } = req.user.found
    const token = await 
      signToken(username)
    
    res.json({
      token: token,
      _id: req.user._id,
      payload: req.user.found
    })
  },
  googleOAuth: async (req, res, next) => {
    const token = await
      signToken(req.user)
    res.status(200).json({ token })
  },

  facebookOAuth: async (req, res, next) =>{
    const token = await
      signToken(req.user)
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

    let userId = await User.find({"email": email}, "id").exec()

    // console.log("userId", userId);

    const token = await 
      signToken(userId[0]._id)

    res.status(200).json({ token })
  }
}

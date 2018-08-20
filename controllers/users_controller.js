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




const signToken = async (username) => {
  return JWT.sign({
    iss: 'austin',
    username,
    iat: new Date()
      .getTime(),
    exp: new Date()
      .setDate(new Date()
        .getDate() + 1 )
  }, Jwt_Secret)
}

module.exports = {
  getAll: async (req, res, next) => {
    let users = await User
      .find({})
      .select('-password -shortId -method -__v')
      .populate({
        path: 'posts', 
        select: 'date title content comments -_id user_id ',
        populate: { 
          path: 'comments user_id',
          select: 'firstName lastName user_id date content upvotes -_id',
          populate: {
            path: 'author',
            select: 'firstName lastName username -_id'
          }
        }
      })

    res.json(users)
  },
  getProfile: async (req, res, next) => {
    const username = req.user.username
    const usersProfile = await User
      .findOne({
       username
      })
      .select('-password -method')
      .populate({
        path: 'posts', 
        populate: {
          path: 'comments',
          populate: 'user_id'
        }
      })
      
    res.json(usersProfile)
  },
  editProfile: async (req, res, next) => {
    const updateSuccess = 'Success!'
    let profileImage
    let bannerImage 
    req.files || req.file 
      ? (profileImage = req.files.profileImage[0], 
        bannerImage = req.files.bannerImage[0])
      : null
    
    
    const reader = new FileReader;
    reader.onload = () => {
      const dataURL = reader.result;
      const base64 = reader.result.split(",").pop();
    }
    input.onchange = () => {
      reader.abort();
      reader.readAsDataURL(`input.files[0]`);
    }

    const { 
      username
    } = req.user.found
    
    const { 
      firstName, 
      lastName
    } = req.body
    
    const updatedData = await User
    .findOneAndUpdate({ 
      username
    }, {
      firstName, 
      lastName,
      profileImage,
      bannerImage 
    })

    if ( updatedData ) {
      const token = await 
      signToken(username)
    
    res.json({
      token,
      updatedData,
      updateSuccess
     })
    } else {
      res.json({msg:'user not found'})
    }
  },
  getUsersPost: async (req, res, next) => {
    let { username } = req.user
    
    let posts = await User
      .findOne({username})
      .populate({
        path: 'posts',
        select: '-fullName',
        populate: {
          path: 'comments',
          select: '-fullName',
          populate: {
            path: 'author',
            select: 'username',
            
          }
        }
      })
      .select('posts')
      
    res.json(
      posts
    )
    
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
      .findByIdAndUpdate(
        id, 
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
    let { 
        firstName, 
        lastName, 
        email, 
        password 
      } = req.body
    let username = req.body
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
        username 
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
    
    let findUser = await User
      .findOne({
        email
      })

    username = findUser.username
    
    const token = await 
      signToken(username)
    
    res.status(200).json({ 
      username, 
      token 
    })
  },
  signIn: async (req, res, next) => {
    const { 
      username
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
    const deleteUsers = await User.find({'facebook.email': email}).remove().exec()
    const foundUser = await User.findOne({'facebook.email': email})

    //if the user exists, send status and err message
    if(foundUser){
      
      return res.status(403).json({error: 'email already exists'})
    }

    const newUser = new User({
      method: 'facebook',
      facebook: {
        email: email,
        password: password
      }
    })

    await newUser.save()

    let userId = await User.find({'email': email}, 'id').exec()


    const token = await 
      signToken(userId[0]._id)

    res.status(200).json({ token })
  }
}

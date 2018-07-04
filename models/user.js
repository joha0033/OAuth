const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const shortId = require('shortId')
// shorten user ID some how...
 // create schema - describe the user
 console.log(shortId.generate())
const UserSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  shortId: {
    type: String, 
    // unique: true, 
    default: shortId.generate()
  },
  google:{
    id:{
      type: String,
    },
    email:{
      type: String,
      lowercase: true
    }
  },

  facebook: {
    id:{
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email:{
      type: String,
      lowercase: true
    },
    accessToken:{
      type: String,
    },
    posts: {
      type: Schema.Types.ObjectId, ref: 'post'
    }
  },

  local: {
    firstName: {
      type: String,
      lowercase: true
    },
    lastName: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String,
    },
    posts: {
      type: Schema.Types.ObjectId, ref: 'post'
    }

  }

})

//before you save a user, lets hash the password
UserSchema.pre('save', async function(next) {

  // if they're trying to log in with G+ or FB, we can next.
  if(this.method !== 'local'){
    next()
  }

  // if the signup method is local, lets hash the password
  try {

    //create salt and hash it!
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.local.password, salt)

    //change the original password to hashed password
    this.local.password = hash

    //peace!
    next()

  } catch(error) {

    next(error)

  }
})

// lets compare hash passwords and see if they match!
UserSchema.methods.isValidPassword = async function(newPassword) {

  try {

    //should return true or false.
    return await bcrypt.compare(newPassword, this.local.password);

  } catch(error) {

    throw new Error(error);

  }
}

 // create model
const User = mongoose.model('user', UserSchema)


 // export schema
module.exports = User

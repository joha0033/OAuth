const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema


 // create schema - describe the use
const UserSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
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
    email:{
      type: String,
      lowercase: true
    }
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String,
    }
  }

})

UserSchema.pre('save', async function(next){
  console.log(this.method);
  if(this.method !== 'local'){
    next()
  }

  try{
    // generate sale
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.local.password, salt)
    this.local.password = hash
    next()
  }catch(error){
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch(error) {
    throw new Error(error);
  }
}

 // create model
const User = mongoose.model('user', UserSchema)


 // export schema
module.exports = User

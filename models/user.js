const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema


 // create schema - describe the use
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', async function(next){
  try{
    // generate sale
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
  }catch(error){
    next(error)
  }
})

UserSchema.methods.isValidPassWord = async function(newPassword){
  try{
    return await bcrypt.compare(newPassword, this.password)
  }catch(error){

  }
}

 // create model
const User = mongoose.model('user', UserSchema)


 // export schema
module.exports = User

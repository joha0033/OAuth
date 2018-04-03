const mongoose = require('mongoose')
const Schema = mongoose.Schema

 // create schema - describe the post
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  level:{
    type: String
  }

})

 // create model
const Post = mongoose.model('post', PostSchema)


 // export schemap
module.exports = Post

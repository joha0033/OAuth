const mongoose = require('mongoose')
const Schema = mongoose.Schema

 // create schema - describe the post
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  user_id: { 
    type: Schema.Types.ObjectId, ref: 'user' 
  },
  level: {
    type: String
  },
  upvotes: {
    type: Number
  },
  downvotes: {
    type: Number
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
  
})

 // create model
const Post = mongoose.model('post', PostSchema)


 // export schemap
module.exports = Post

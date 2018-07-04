const mongoose = require('mongoose')
const Schema = mongoose.Schema

 // create schema - describe the post
const CommentSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, ref: 'user' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  content:{
    type: String,
    required: true
  },
  post_id:{
    type: Schema.Types.ObjectId, ref: 'post' 
  },
  upvotes: {
    type: Number
  },
  downvotes: {
    type: Number
  }
})

 // create model
const Comment = mongoose.model('comment', CommentSchema)


 // export schemap
module.exports = Comment

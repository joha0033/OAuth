const mongoose = 
  require('mongoose')

const Schema = 
  mongoose.Schema


const CommentSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'user' 
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
    type: Schema.Types.ObjectId, 
    ref: 'post' 
  },
  upvotes: {
    type: Number
  },
  downvotes: {
    type: Number
  }
})

const Comment = mongoose
  .model(
    'comment', 
    CommentSchema
  )

module.exports = Comment

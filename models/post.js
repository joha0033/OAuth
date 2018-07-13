const mongoose = 
  require('mongoose')

const Schema = 
  mongoose.Schema


const PostSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'user' 
  },
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
  level: {
    type: String
  },
  upvotes: {
    type: Number
  },
  downvotes: {
    type: Number
  },
  comments: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'comment' 
    }
  ]
  
})

const Post = mongoose
  .model(
    'post', 
    PostSchema
  )

module.exports = Post

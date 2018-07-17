const mongoose = 
  require('mongoose')

const Schema = 
  mongoose.Schema


const CommentSchema = new Schema({
  // user_id: { 
  //   type: Schema.Types.ObjectId, 
  //   ref: 'user'
  // },
  user_id: { 
    type: String
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

CommentSchema
  .virtual('author', {
    ref: 'user', 
    localField: 'user_id', 
    foreignField: '_id',
    justOne: true
  })

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('id', false);

const Comment = mongoose
  .model(
    'comment', 
    CommentSchema
  )

module.exports = Comment

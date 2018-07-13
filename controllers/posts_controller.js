
const Post = 
  require('../models/post')

const Comment = 
  require('../models/comment')

const { posts } = 
  require('./seeds/post_seeds')

const { comments } = 
  require('./seeds/comment_seeds')

module.exports ={
  create: async (req, res, next) => {    
    const { 
      title, 
      content, 
      category, 
      level 
    } = req.body
    const titleTaken = await Post
      .findOne({ 
        title  
      })
    
    if (titleTaken){
      return res.status(403)
        .json({
          error: 'title is taken...'
        })
    }
    
    const newPost = new Post({
      title,
      content,
      category,
      level
    })
    
    await newPost.save()
    
    res.status(200).json({
      got:  req.body
    })
  },
  getAll: (req, res, next) => {
    Post.find({})
      .populate({
        path: 'comments', 
        populate: { 
          path: 'user_id' 
        }
      })
      .populate('user_id')
      .exec((err, posts) => {
      res.send(posts)
    })
  }
}

const Post = require('../models/post')
const Comment = require('../models/comment')
const { posts } = require('./post_seeds')
const {comments} = require('./comment_seeds')



module.exports ={
  seedPosts: async (req, res, next) => {
    const seedPosts = (seeds) => {
      seeds.map((post)=>{
        let newPost = new Post(post)
        newPost.save();
      })
    }
    const seedComments = (seeds) => {
      seeds.map((comment)=>{
        let newComment = new Comment(comment)
        newComment.save();
      })
    }

    return process.env.NODE_ENV !== 'production'  
    ? ( Post.remove({}).exec(), 
        seedPosts(posts), seedComments(comments),
        res.json({msg: 'Database cleared and seeded posts!'}))
    : ( res.json({msg: 'Your environment is in Production, cannot kill & reseed'}) )
   
  },
  seedComments: async (req, res, next) => {
    const seedComments = (seeds) => {
      seeds.map((comment)=>{
        
        let newComment = new Comment(comment)
        newComment.save();
      })
    }

    return process.env.NODE_ENV !== 'production'  
    ? ( Comment.remove({}).exec(), seedComments(comments),
        res.json({msg: 'Database cleared and seeded comments!'}))
    : ( res.json({msg: 'Your environment is in Production, cannot kill & reseed'}) )
   
  },
  create: async (req, res, next) => {
    console.log('req.body',req.body);
    
    const { title, content, category, level } = req.body

    console.log('title, content',title, content);

    let titleTaken = await Post.findOne({ title  })
    console.log('titleTaken', titleTaken);

    if(titleTaken){
      return res.status(403).json({error: 'title is taken...'})
    }

    const newPost = new Post({
      title,
      content,
      category,
      level
    })

    console.log('newPost', newPost);

    await newPost.save()

    res.status(200).json({
      got:  req.body
    })
  },

  getAll: async (req, res, next) => {

  //  await Comment.find({}).populate('user_id').exec((err, comments) => {
  //   console.log(comments)
  //  })
    
    await Post.find({})
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

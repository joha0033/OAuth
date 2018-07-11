const Post = require('../models/post')
const Comment = require('../models/comment')
const { posts } = require('./seeds/post_seeds')
const { comments } = require('./seeds/comment_seeds')



module.exports ={
  seed: async (req, res, next) => {
    const seedPosts = (seeds) => {
      
      seeds.map((post)=>{
        let newPost = new Post(post)
        console.log(newPost);
        
        newPost.save();
      })
    }

    return process.env.NODE_ENV !== 'production'  
    ? ( Post.remove({}).exec(), 
        seedPosts(posts),
        res.json({msg: 'Database cleared and seeded posts!'}))
    : ( res.json({msg: 'Your environment is in Production, cannot kill & reseed'}) )
  },
  create: async (req, res, next) => {    
    const { title, content, category, level } = req.body
    let titleTaken = await Post.findOne({ title  })

    if (titleTaken){
      return res.status(403).json({error: 'title is taken...'})
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
  getAll: async (req, res, next) => {
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

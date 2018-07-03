const Post = require('../models/post')
const {posts} = require('./post_seeds')


module.exports ={
  seed: async (req, res, next) => {
    const seedPosts = (seeds) => {
      seeds.map((post)=>{
        let newPost = new Post(post)
        newPost.save();
      })
    }

    return process.env.NODE_ENV !== 'production'  
    ? ( Post.remove({}).exec(), 
        seedPosts(posts), 
        res.json({msg: 'Database cleared and seeded!'}))
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

    let posts = await Post.find({})
    console.log(posts)
    res.send(posts)

  }
}

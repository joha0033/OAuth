const Post = require('../models/post')

module.exports ={

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
    //manipulate data here if needed
    res.send(posts)

}
}

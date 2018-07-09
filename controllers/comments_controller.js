const Comment = require('../models/comment')
const comments = require('./seeds/comment_seeds')

module.exports = {
    getAll: async (req, res, next) => {
          await Comment.find({}).populate("user_id").exec(((err, comments) => {
            res.send(comments);
          }))
          
          
        },
    seed: async (req, res, next) => {
        const seedComments = (seeds) => {
          console.log(seeds);
          
          seeds.map((comment)=>{
            let newComment = new Comment(comment)
            newComment.save();
          })
        }
    
        return process.env.NODE_ENV !== 'production'  
        ? ( Comment.remove({}).exec(), seedComments(comments),
            res.json({msg: 'Database cleared and seeded comments!'}))
        : ( res.json({msg: 'Your environment is in Production, cannot kill & reseed'}) )
       
      }
}
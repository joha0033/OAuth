const Comment = 
  require('../models/comment')
  
const comments = 
  require('./seeds/comment_seeds')

module.exports = {
    getAll: async (req, res, next) => {
          let comments = await Comment
            .find({})

          return res.json(comments)  
    }
}
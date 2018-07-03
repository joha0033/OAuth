const express = require('express');
// const router = express.Router()
const router = require('express-promise-router')();

const { validateBody, schemas } = require('../helpers/routeHelpers')
const PostsController = require('../controllers/posts_controller');



router.route('/create').post(validateBody(schemas.postSchema), PostsController.create)

router.route('/getall').get(PostsController.getAll)

router.route('/seed').get(PostsController.seed)



module.exports = router

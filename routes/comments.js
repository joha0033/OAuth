const express = require('express');
const router = require('express-promise-router')();
const CommentsController = require('../controllers/comments_controller');

router.route('/getall').get(CommentsController.getAll)

router.route('/seed').get(CommentsController.seed)



module.exports = router

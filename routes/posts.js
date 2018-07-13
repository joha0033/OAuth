const express = 
    require('express');

// const router = express.Router()
const requestTo = 
    require('express-promise-router')();

const { 
    validateBody, 
    schemas 
} = 
    require('../helpers/routeHelpers')

const PostsController = 
    require('../controllers/posts_controller');


requestTo
    .route(
        '/create'
    )
    .post(
        PostsController
        .create
    )

requestTo
    .route(
        '/getall'
    )
    .get(
        PostsController.getAll
    )

module.exports = requestTo

const express = 
    require('express');

const requestTo = 
    require('express-promise-router')();

const CommentsController = 
    require('../controllers/comments_controller');

requestTo
    .route(
        '/getall'
    )
    .get(
        CommentsController
            .getAll
    )

module.exports = requestTo

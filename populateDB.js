console.log(
'This script populates some test Users, Posts, and Comments to your database.',
'Specified database as argument -', 
'e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
let userArgs = process.argv.slice(2);

if (!userArgs[0]
    .startsWith('mongodb://')) {
    console.log(
        'ERROR: You need to specify a valid mongodb URL as the first argument', 
        userArgs
    ) 
    return
}

const async = 
    require('async')

const User = 
    require('./models/user')

const Post = 
    require('./models/post')

const Comment = 
    require('./models/comment')

let mongoose = 
    require('mongoose')

let mongoDB = userArgs[0]

mongoose
    .connect(mongoDB);

mongoose.Promise = 
    global.Promise;

let db = mongoose
    .connection;

db.on(
    'error', 
    console.error.bind(console, 
        'MongoDB connection error:'
        )
    )

let users = []
let posts = []
let comments = []

const clearUserCollection = 
    (callback) => (
        User.remove({})
            .exec(callback)
    )
const clearCommentCollection = 
    (callback) => (
        Comment.remove({})
            .exec(callback)
    )
const clearPostCollection = 
    (callback) => (
        Post.remove({})
            .exec(callback)
    )

async.series([
    clearUserCollection,
    clearCommentCollection,
    clearPostCollection
], (err, results) => {
    console.log(
        'cleared:', 
        results
    );
})

const createUser = (
    { ...newUser }, 
    callback 
    ) => {
    newUser = new User(newUser)

    newUser
        .save((err) => {
            if(err) { 
                callback(err, null) 
                return 
            }

            users
                .push(newUser)

            callback(null, newUser)
        })
}

const createComment = (
    { ...newComment }, 
    callback 
    ) => {
    newComment = new Comment(newComment)
    
    newComment
        .save((err) => {
            if(err) { 
                callback(err, null) 
                return 
            }

            comments
                .push(newComment)

            callback(null, newComment)
        })
    }

const createPost = ( 
    { ...newPost }, 
    callback 
    ) => {
    newPost = new Post(newPost)

    newPost
        .save((err) => {
            if(err) { 
                callback(err, null) 
                return 
            }

            posts
                .push(newPost)
            callback(null, newPost)
        })
    }


const createUsers = ( cb ) => {
    async.parallel([
        (callback) => createUser({
            "username": "testlocal",
            "firstName": "test",
            "lastName": "local",
            "email": "testlocal@gmail.com",
            "password": "test321",
            "createdOn": Date().now,
            "method": "local",

        }, callback),
        (callback) => createUser({
            "username": "swifty",
            "firstName": "taylor",
            "lastName": "swifty",
            "email": "swifty@gmail.com",
            "password": "test321",
            "createdOn": Date().now,
            "method": "local",
        }, callback),
        (callback) => createUser({
            "username": "user01",
            "firstName": "tay",
            "lastName": "boo",
            "email": "user01@gmail.com",
            "password": "test321",
            "createdOn": Date().now,
            "method": "local"
        }, callback),
        (callback) => createUser({
            "username": "DKnots",
            "firstName": "Don",
            "lastName": "Knots",
            "email": "DKnots@gmail.com",
            "password": "test321",
            "createdOn": Date().now,
            "method": "local",        
        }, callback),
        (callback) => createUser({
            "username": "test",
            "firstName": "taylor",
            "lastName": "doggs",
            "email": "test@gmail.com",
            "password": "test321",
            "createdOn": Date().now,
            "method": "local",
        }, callback),
        (callback) => createUser({
            "username": "test",
            "firstName": "test",
            "lastName": "test",
            "email": "test@gmail.com",
            "password": "test321",
            "createdOn": Date().now,
            "method": "local"
        }, callback)
    ], cb)
}


const createComments = ( cb ) => {
    async.parallel([
        (callback) => createComment({
            "user_id": users[0]._id,
            "content": "this is a great place to comment....",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
        (callback) => createComment({
            "user_id": users[1]._id,
            "content": "I'm not really sure what Lorem Ipsum is supposed to solve... ",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
        (callback) => createComment({
            "user_id": users[2]._id,
            "content": "Thank you for all of your hard work!",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
        (callback) => createComment({
            "user_id": users[2]._id,
            "content": "OMG this is amazing!",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
        (callback) => createComment({
            "user_id": users[4]._id,
            "content": "SMFH!",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
        (callback) => createComment({
            "user_id": users[3]._id,
            "content": "this is dumb",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
        (callback) => createComment({
            "user_id": users[5]._id,
            "content": "No you are!!!",
            "upvotes": 5,
            "downvotes": 1
        }, callback),
    ], cb)
}

const createPosts = ( cb ) => {
    async.parallel([
        (callback) => createPost({
            "title": "Github Basics",
            "user_id": users[0]._id,
            "content": "coming soon",
            "category": "Github",
            "level": "Beginner",
            "comments": [comments[0]._id, comments[1]._id, comments[5]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "Github Introduction",
            "user_id": users[0]._id,
            "content": "coming soon",
            "category": "Github",
            "level": "Beginner",
            "comments": [],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "Github Add/Commit/Push",
            "user_id": users[0]._id,
            "content": "coming soon",
            "category": "Github",
            "level": "Beginner",
            "comments": [comments[0]._id, comments[4]._id, comments[6]._id],
            "upvotes": 9,
        }, callback),
        (callback) => createPost({
            "title": "Github Roll-back/Merge Branches",
            "user_id": users[0]._id,
            "content": "coming soon",
            "category": "Github",
            "level": "Intermediate",
            "comments": [comments[0]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "CLI Basics",
            "user_id": users[1]._id,
            "content": "coming soon",
            "category": "Command Line",
            "level": "Beginner",
            "comments": [comments[2]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "CLI Intro",
            "user_id": users[1]._id,
            "content": "coming soon",
            "category": "Command Line",
            "level": "Beginner",
            "comments": [comments[1]._id, comments[2]._id, comments[3]._id, comments[6]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "CLI Creating and writing to files",
            "user_id": users[3]._id,
            "content": "coming soon",
            "category": "Command Line",
            "level": "Intermediate",
            "comments": [comments[0]._id, comments[4]._id, comments[6]._id, comments[1]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "CLI Creating Directories",
            "user_id": users[1]._id,
            "content": "coming soon",
            "category": "Command Line",
            "level": "Beginner",
            "comments": [comments[0]._id, comments[1]._id, comments[4]._id, comments[6]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "CLI and NPM",
            "user_id": users[2]._id,
            "content": "coming soon",
            "category": "Command Line",
            "level": "Intermediate",
            "comments": [comments[1]._id, comments[2]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "Text Editor options",
            "user_id": users[5]._id,
            "content": "coming soon",
            "category": "Text Editor",
            "level": "Beginner",
            "comments": [comments[0]._id, comments[2]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "Text Intro",
            "user_id": users[2]._id,
            "content": "coming soon",
            "category": "Text Editor",
            "level": "Beginner",
            "comments": [comments[0]._id, comments[2]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "Text Intro",
            "user_id": users[4]._id,
            "content": "coming soon",
            "category": "Text Editor",
            "level": "Beginner",
            "comments": [comments[4]._id, comments[6]._id, comments[2]._id, comments[0]._id],
            "upvotes": 9
        }, callback),
        (callback) => createPost({
            "title": "Text Editor Linting",
            "user_id": users[5]._id,
            "content": "coming soon",
            "category": "Text Editor",
            "level": "Advanced",
            "comments": [comments[0]._id, comments[2]._id],
            "upvotes": 9
        }, callback),
    ], cb)
}

const fillUserPosts = (cb) => {
    posts.map((post) => {
        users.map((user) => {
            if(post.user_id === user._id) {
                user.posts
                    .push(post._id)
            }
        })
    })
    cb(null, users)
}

const updateUsersWithPosts = (cb) => {
   users.map((user) => {
        let id = user._id
        let change = {
           $set: {
               posts: [ 
                   ...user.posts
                ]
            }
        }
        let options = {
           new: true
        }
        const queryCallback = (err, user) => {
            if (err) cb(err, null);
        }

       User
        .findByIdAndUpdate(
            id, 
            change, 
            options, 
            queryCallback
      );
   })

   cb(null, 'dick')
}

const seriesCallback = (
    err, 
    results
    ) => {
        if (err) { 
            console.log(
                'final err', 
                err
            ) 
        } else { 
            console.log(
                'series results: ', 
                results
            )

            mongoose
                .connection
                    .close()
        }
    }

async.series([
    createUsers,
    createComments,
    createPosts,
    fillUserPosts,
    updateUsersWithPosts
], seriesCallback)             

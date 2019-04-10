let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser'); // middleware for process incominng requests
let session = require('express-session');
let passport = require('passport');
let mongoose = require('mongoose');

require('./passport')(passport);

// **Database setup
// use development
// db.createUser( { user: "express", pwd: "expressapp", roles: [ "readWrite" ], mechanisms:["SCRAM-SHA-1"] } )
const server = '127.0.0.1:27017'
const database = 'development'
const user = 'express'
const password = 'expressapp'
mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`)

// **Middlewares
app.use(bodyParser.urlencoded({ // bordy-parser accepts only form-urlencoded
    extended: true
  }));
app.use(bodyParser.json()) // create attribute body from incoming json

// Auth
app.use(session({
    secret:'secretkey', // encrypting session data
    saveUninitialized: false,
    resave: false
}))

app.use(passport.initialize())
app.use(passport.session());
// process req first
app.use((req, res, next) => {
    console.log(`A request to this url ${req.originalUrl} will be made`, req.body)
    next() // continue processing
})

// **Routes
let recipeRoute = require('./routes/recipe')
let authRouter = require('./routes/auth')(passport)
app.use(recipeRoute)
app.use(authRouter)

// **Static files
// serves the index.html
app.use(express.static('public'))


// **Catch errors
app.use((req, res) => {
    res.status(404).send("404 - NOT FOUND.")
})
app.use((err, req, res, next) => {
    console.error(err.stack) // 500
    res.sendFile(path.join(__dirname, '../public/500.html'))
})

// **Run the server using a proxy to avoid CORS errors
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server running on ${PORT}`));
let express = require('express');
let router = express.Router()
let RecipeModel = require('../models/recipe.model')

// **Auth
isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({error:"You are not allowed to access this endpoint."})
}

// **Post
router.post('/recipe', isAuthenticated, (req, res) => {
    // req.body
    let emptyObj = !Object.keys(req.body).length;
    if (emptyObj) {
        return res.status(404).send("No recipe data found!.")
    }

    let model = new RecipeModel(req.body)
    console.log(req.body);
    model.save()
        .then(doc => {
            // faild to save data
            if (!doc || doc.length ===0) {
                console.log('Error saving!...')
                return res.status(500).send(doc)
            }
            // success
            console.log(`Success:${doc}`)
            res.status(201).send(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
   
})

// **Get requests
router.get('/find/recipe/', isAuthenticated, (req, res) => {
    if (!req.query.name) {
        return res.status(400).send('Missing recipe name.')
    }

    RecipeModel.findOne({
        name: req.query.name
    })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.get('/recipe', isAuthenticated, (req, res) => {
    // check if there is query
    // /recipe?name=halo2
    if (req.query.name) {
        res.send(`You have search for: ${req.query.name}`)
    } else {
        res.send('Requested recipe route')
    }
})

router.get('/recipe/:name', isAuthenticated, (req, res) => {

    if (!req.params.name) {
        return res.status(400).send('Missing recipe name.')
    }

    RecipeModel.findOne({
        name: req.params.name
    }, req.body, { // return the req.body
        new: true
    })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })

})

router.get('/recipes', isAuthenticated, (req, res) => {
    RecipeModel.find({})
        .then(recipes=>{
            res.json(recipes)
        })
        .catch(err=>{
            res.status(500).json(err)
        })
})


// **Update
router.put('/recipe', isAuthenticated, (req, res) => {
    if (!req.query.name) {
        return res.status(400).send('Missing recipe name.')
    }

    RecipeModel.findOneAndUpdate({
        name: req.query.name
    }, req.body, { // return the req.body
        new: true
    })
        .then(doc => {
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/recipes', isAuthenticated, (req, res) => {
    // req.body
    if (!req.body && req.body instanceof Array) {
        return res.status(404).send("Expects a list of recipes")
    }
    // for dev purposes
    // delete existing records
    RecipeModel.deleteMany({})
        .then(status => {
            console.log('Deleting: ', status)
        })
        .catch(err => {
            console.log('Error: ');
            console.log(err);
        })

    var arr = JSON.parse(JSON.stringify(req.body))
    arr.forEach(element => {
        let model = new RecipeModel(element)
        model.save()
        .then(doc => {
            // faild to save data
            if (!element || element.length ===0) {
                console.log('Error saving!...')
                return res.status(500).send(doc)
            }
        })
        .catch((err, req, res, next) => {
            if (res.headersSent) {
                return next(err)
              }
              res.status(500).json(err)
        })
    });

    res.status(201).send(arr)
})

// **Delete
router.delete('/recipe', isAuthenticated, (req, res) => {
    if (!req.query.name){
        res.status(400).send("No data to delete.")
    }
    RecipeModel.findOneAndRemove({
        name: req.query.name
    })
        .then(doc =>{
            res.json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

// Simulating error 500
// throw a server error on this route
router.get('/error', (req, res) => {
    throw new Error('Error 500.');
})



// make this available to other modules
module.exports = router
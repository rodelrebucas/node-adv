let express = require('express');
let router = express.Router()
let User = require('../models/user.model');

module.exports = (passport) => {
    router.post('/signup', (req, res) => {
        console.log(req.body);
        // req.body
        let emptyObj = !Object.keys(req.body).length;
        if (emptyObj) {
            return res.status(404).json({error:"User data not found!"})
        }
        else {
            User.findOne(
                {username:req.body.username},
                 (err, doc) => {
                    if (err) {
                        res.status(500).json(err)
                    }
                    else {
                        if (doc) {
                            res.status(500).json({error:"User already exist"})
                        }
                        else {
                            let model = new User()
                            model.username = req.body.username
                            model.password = model.hashPassword(req.body.password)
                            model.save()
                                .then(doc => {
                                // faild to save data
                                if (!doc || doc.length ===0) {
                                    return res.status(500).json({error:'Error saving!...'})
                                }
                                res.status(201).json(req.body) // or you can return the user/doc
                            })
                            .catch(err => {
                                res.status(500).json(err)
                            })
                        }
                    }
                   
                 })
        }
    })
    
    router.post('/login', passport.authenticate('local', { failWithError: true}),
        function (req, res) { // success callback
            res.status(200).json({success: true})
        },
        function(err, req, res, next) { // error callback
            res.status(401).json(req.authError);
        }
    );

    router.get('/authenticated', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).json({authenticated: true});
        }
        return res.status(401).json({error: "Log in required!"});
    })

    router.get('/logout', (req, res) => {
        req.logout();
        res.status(201).json({success: true})
    })

    return router;
}

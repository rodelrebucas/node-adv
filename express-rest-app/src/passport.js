let localStrategy = require('passport-local').Strategy;
let User = require('./models/user.model');

module.exports = (passport) => {
    passport.serializeUser((user, done) => { // add user to session
        done(null,user)
    })
    passport.deserializeUser((user, done) => { // remove user from session
        done(null,user)
    })
    let findUser = (req, username, password, done) => {
        User.findOne({username:username})
            .then(doc=> {
                if (doc) {
                    const valid = doc.comparePassword(password, doc.password)
                    if (valid) {
                        // done attached use to request/req
                        return done(null, {
                            username: doc.username,
                            password: doc.password
                        })
                    } else {
                        req.authError = {error: "Password don't match"};
                        return done(null, false)
                    }
                } else {
                    req.authError = {error: "No User Found!"};
                    return done(null, false)
                }
            })
            .catch(err => {
                req.authError = err;
                return done(null, false)
            })
    }

    passport.use(new localStrategy({passReqToCallback:true}, findUser));

    // passport.use(new localStrategy((username, password, done) => {
    //     User.findOne({username:username})
    //         .then(doc=> {
    //             if (doc) {
    //                 const valid = doc.comparePassword(password, doc.password)
    //                 if (valid) {
    //                     done(null, {
    //                         username: doc.username,
    //                         password: doc.password
    //                     })
    //                 } else {
    //                     console.log("Password don't match")
    //                     done(null, false)
    //                 }
    //             } else {
    //                 console.log("No User Found!")
    //                 done(null, false)
    //             }
    //         })
    //         .catch(err => {
    //             done(err)
    //         })
    // }))

}
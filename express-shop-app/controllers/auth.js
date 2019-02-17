const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  //   res.setHeader('Set-Cookie', 'loggedIn=True')
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (match) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            // make sure redirect after saving session
            return req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        }) // failed
        .catch(err => res.redirect("/login"));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  //   res.setHeader('Set-Cookie', 'loggedIn=True')
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignUp = (req, res, next) => {
  User.findOne({ ...req.body })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bccrypt
        .hash(req.body.password, 12)
        .then(password => {
          const user = User({
            ...req.body,
            ...{ password: password },
            ...{ cart: { items: [] } }
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSignUp = (req, res, next) => {
  //   res.setHeader('Set-Cookie', 'loggedIn=True')
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: false
  });
};

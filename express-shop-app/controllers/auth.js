const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  //   res.setHeader('Set-Cookie', 'loggedIn=True')
  User.findById("5c6935362fcc8801ce30aaaa")
    .then(user => {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.user = user;

        // make sure redirect after saving session
        req.session.save(err => {
          console.log(err);
          res.redirect("/");
        });
      }
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

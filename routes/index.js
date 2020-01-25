const express = require('express');
const router = express.Router();
const passport = require('passport');
// const User = require('../models/user');

router.get('/', function(req, res){
    res.render('landing');
});

 // auth routes
//show register form
router.get('/register', function(req, res) {
    res.render('register');
});
// handle sign up
router.post('/register', passport.authenticate("local-signup", {
    successRedirect: "/restaurants",
    failureRedirect: "/register",
    failureFlash: true
}));

//show login form
router.get('/login', function(req, res) {
    res.render('login');
});
//handling login logic
router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true
}),function (req, res) {}
)

//logut route
router.get("/logout", function(req, res){
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect("/restaurants");
 });

module.exports = router;
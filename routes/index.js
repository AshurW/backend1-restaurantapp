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
router.post('/register', function(req, res) {
    // let newUser = new User({username: req.body.username});
    // User.register(newUser, req.body.password, function(err, user) {
    //     if(err) {
    //         req.flash('error', err.message);
    //         return res.render('register');
    //     }
    //     passport.authenticate('local')(req, res, function(){
    //         req.flash('success', 'Welcome to YelpCamp' + user.username);
    //         res.redirect('/campgrounds');
    //     });
    // });
});

//show login form
router.get('/login', function(req, res) {
    res.render('login');
});
//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req, res){
});

//logut route
router.get("/logout", function(req, res){
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect("/restaurants");
 });

module.exports = router;
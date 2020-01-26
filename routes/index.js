const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function(req, res){
    res.render('landing');
});


//show register form
router.get('/register', function(req, res) {
    res.render('register');
});
// handle sign up
router.post('/register', passport.authenticate("local-signup", {
    successRedirect: "/restaurants",
    failureRedirect: "/register",
}),function (req, res) {}
);

//show login form
router.get('/login', function(req, res) {
    res.render('login');
});
//handling login logic
router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
}),function (req, res) {}
);

//logut route
router.get("/logout", function(req, res){
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect("/restaurants");
 });

module.exports = router;
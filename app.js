const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');

const restaurantRoutes = require('./routes/restaurants');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index')



const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_resty'
});

db.connect(function(err){
    if(err){
        console.log(err);
        return
    } else {
        console.log('connected to db');
    }
})

//passport config
// app.use(require("express-session")({
//     secret: 'thisisascretfromashur',
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    req.db = db;
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash('error');
    // res.locals.success = req.flash('success');
    next();
 });

app.use('/', indexRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/comments', commentRoutes);

app.listen(PORT, function(){
    console.log('The Server has started');
});
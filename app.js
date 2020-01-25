const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const bcrypt = require("bcrypt-nodejs");

const restaurantRoutes = require('./routes/restaurants');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index')


const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));

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

db.connect(function (err) {
    if (err) {
        console.log(err);
        return
    } else {
        console.log('connected to db');
    }
});

// passport config
db.query('USE db_resty;')

app.use(require("express-session")({
    secret: 'thisisascretfromashur',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = ?",
        [id], (err, rows) => {
            done(err, rows[0])
        })
})

passport.use(
    "local-signup",
    new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    },
        function (req, username, password, done) {
            db.query("SELECT * FROM users WHERE username = ?",
                [username], function (err, rows) {
                    if (err) {
                        return done(err)
                    }
                    if (rows.length) {
                        return done(null, false, req.flash("signupMessage", "Username already in use!"))
                    } else {
                        let newUser = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)
                        }

                        let insert = "INSERT INTO users (username, password) VALUES (?,?)";

                        db.query(insert, [newUser.username, newUser.password],
                            function (err, rows) {
                                newUser.user_id = rows.insertId;
                                return done(null, newUser)
                            })

                    }
                })
        }

    )
)

passport.use(
    "local-login",
    new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    },
        function (req, username, password, done) {
            db.query("SELECT * FROM users WHERE username = ? ", [username],
                function (err, rows) {
                    if (err) {
                        return done(err);
                    }
                    if (!rows.length) {
                        return done(null, false, req.flash("loginMessage", "User doesn't exist!"))
                    }
                    if (!bcrypt.compareSync(password, rows[0].password)) {
                        return done(null, false, req.flash("loginMessage", "Password is incorrect!"))
                    }
                    return done(null, rows[0])
                })
        })
)



app.use(function (req, res, next) {
    req.db = db;
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash('error');
    // res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/comments', commentRoutes);

app.listen(PORT, function () {
    console.log('The Server has started');
});
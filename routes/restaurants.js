const express = require('express');
const router = express.Router();
const middleware = require("../middleware");

//display all restaurants
router.get('/', function(req, res) {
    const db = req.db;
    db.query('SELECT * FROM restaurants', function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            // console.log(data);
            res.render('restaurants/index', {restaurants:data});
        } 
    });
});


//create restaurant
router.post('/', middleware.isLoggedIn, function(req, res) {
    const db = req.db;
    let newRestaurant = {name: req.body.name, image: req.body.image, description: req.body.description, userid: req.user.id}
    let sql = 'INSERT INTO restaurants SET ?'
    db.query(sql, newRestaurant, function(err, result){
        if(err) {
            console.log(err);
        } else {
            //console.log(result);
            res.redirect('/restaurants');
        } 
    });
});

router.get('/new',  middleware.isLoggedIn, function(req, res) {
    res.render('restaurants/new');
});

// Show Restaurants
router.get("/:id", function(req, res){
    const db = req.db;
    let sql = `SELECT restaurants.id, restaurants.name, restaurants.image, restaurants.description, users.username FROM restaurants INNER JOIN users ON restaurants.userid = users.id WHERE restaurants.id = ${req.params.id}`;
    let commentSql = `SELECT * FROM comments WHERE comment_rest_id = ${req.params.id}`;
    db.query(sql, function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            console.log(data);
            db.query(commentSql, function(err, commentRow){
                if(err){
                    console.log(err) 
                } else {
                    let commentData = JSON.parse(JSON.stringify(commentRow));
                    //console.log(commentData);
                    res.render('restaurants/show', {restaurant:data[0], comments:commentData});
                }
            })
        } 
    });
});

// EDIT RESTAURANT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    const db = req.db;
    let sql = `SELECT * FROM restaurants WHERE id = ${req.params.id}`;
    db.query(sql, function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            //console.log(data);
            res.render('restaurants/edit', {restaurant:data[0]});
        } 
    });
});

// UPDATE RESTAURANT ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
    const db = req.db;
    let sql = `UPDATE restaurants SET name = ?, image = ?, description = ? WHERE id = ${req.params.id}`;
    db.query(sql, [req.body.restaurant.name, req.body.restaurant.image, req.body.restaurant.description], function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            //console.log(data);
            res.redirect('/restaurants/' + req.params.id);
        } 
    });
});

// DESTROY RESTAURANT ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){

    const db= req.db;
    let sql = `DELETE from restaurants WHERE id = ${req.params.id}`
    db.query(sql, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/restaurants');
        }
    })
});
module.exports = router;
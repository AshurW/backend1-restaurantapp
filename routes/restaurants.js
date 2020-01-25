const express = require('express');
const router = express.Router();
const mysql = require('mysql');
// const Campground = require('../models/campground');
const middleware = require("../middleware");


router.get('/', function(req, res) {
    // get all campgrounds from DB
    // Campground.find({}, function(err, allCampgrounds) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.render('campgrounds/index', {campgrounds:allCampgrounds})
    //     }
    // })
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


//create campground
router.post('/', function(req, res) {
    const db = req.db;
    let newCampground = {name: req.body.name, image: req.body.image, description: req.body.description, userid: 1}
    let sql = 'INSERT INTO restaurants SET ?'
    db.query(sql, newCampground, function(err, result){
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect('/campgrounds');
        } 
    });
});

router.get('/new',  middleware.isLoggedIn, function(req, res) {
    res.render('restaurants/new');
});

router.get("/:id", function(req, res){
    // //find the campground with provided ID
    // Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         //render show template with that campground
    //         res.render("campgrounds/show", {campground: foundCampground});
    //     }
    // });
    const db = req.db;
    let sql = `SELECT * FROM restaurants WHERE id = ${req.params.id}`;
    db.query(sql, function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            //console.log(data);
            res.render('restaurants/show', {restaurant:data[0]});
        } 
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", function(req, res){
    // Campground.findById(req.params.id, function(err, foundCampground){
    //     res.render("campgrounds/edit", {campground: foundCampground});
    // });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
    // find and update the correct campground
    // Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    //    if(err){
    //        res.redirect("/campgrounds");
    //    } else {
    //        //redirect somewhere(show page)
    //        res.redirect("/campgrounds/" + req.params.id);
    //    }
    // });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", function(req, res){
//    Campground.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           res.redirect("/campgrounds");
//       }
//    });
});
module.exports = router;
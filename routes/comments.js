const express = require('express');
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");



router.get('/new', middleware.isLoggedIn, function(req, res) {
    const db = req.db;
    let sql = `SELECT * FROM restaurants WHERE id = ${req.params.id}`;
    db.query(sql, function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            //console.log(data);
            res.render('comments/new', {restaurant:data[0]});
        } 
    });
});

//create comment
router.post("/", middleware.isLoggedIn, function(req, res){
    const db = req.db;
    let sql = `SELECT * FROM restaurants WHERE id = ${req.params.id}`;
    db.query(sql, function(err, rows){
        if(err) {
            console.log(err);
            res.redirect('/restaurants')
        } else {
         let newComment = {text: req.body.comment.text, rating: req.body.comment.rating, comment_user_username:req.user.username, comment_rest_id: req.params.id}
         let sql = 'INSERT INTO comments SET ?'
         db.query(sql, newComment, function(err, result){
             if(err) {
                 console.log(err);
             } else {
                 //console.log(result);
                 res.redirect('/restaurants/' + req.params.id);
             } 
         });
        } 
    });
 });

 // COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.isLoggedIn, function(req, res){
    const db = req.db;
    let sql = `SELECT * FROM comments WHERE cId = ${req.params.comment_id}`;
    db.query(sql, function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            //console.log(data);
            res.render('comments/edit', {restaurant_id: req.params.id, comment:data[0]});
        } 
    });
 });
 
 // COMMENT UPDATE
 router.put("/:comment_id", middleware.isLoggedIn, function(req, res){
    const db = req.db;
    let sql = `UPDATE comments SET text = ?, rating = ? WHERE cId = ${req.params.comment_id}`;
    db.query(sql, [req.body.comment.text, req.body.comment.rating], function(err, rows){
        if(err) {
            console.log(err);
        } else {
            let data = JSON.parse(JSON.stringify(rows));
            //console.log(data);
            res.redirect('/restaurants/' + req.params.id);
        } 
    });
 });
 
 // COMMENT DESTROY ROUTE
 router.delete("/:comment_id", middleware.isLoggedIn, function(req, res){
    const db= req.db;
    let sql = `DELETE from comments WHERE cId = ${req.params.comment_id}`
    db.query(sql, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/restaurants/' + req.params.id);
        }
    })
 });

 
 module.exports = router;
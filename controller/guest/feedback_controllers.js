const express = require('express');
const router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
 var Category = require("../../models/Category");
var User = require("../../models/User");
var Feedback = require("../../models/Feedback")
router.get('/feedback', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'feedback/feedback';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        Category.find()
        .populate('propertyId')
        .exec((err, data)=>{
          res.render('guest/index', { main: main, user: user,data:data, url: url })   
     
        })
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        Category.find()
        .populate('propertyId')
        .exec((err, data)=>{
                res.render('guest/index', { main: main, user: user,data:data, url: url })
        })
    }
});
router.post('/api/ProcessAddFeedback',(req,res)=>{
    var name_feedback = req.body.name_feedback;
    var feedback = req.body.feedback
    var obj_insert={
        'username':req.body.name_feedback,
        'feeback':req.body.feedback
        
    }
    Feedback.create(obj_insert,(err,data)=>{
        if(err) throw err
        res.send({kq:1})
    })
})
module.exports = router;
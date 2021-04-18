const express = require('express');
const router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
 var Category = require("../../models/Category");
var User = require("../../models/User");
router.get('/contact', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'contact/contact';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        var quantity = null
        Category.find()
        .populate('propertyId')
        .exec((err, data)=>{
          res.render('guest/index', { main: main, user: user,quantity:quantity,data:data, url: url })   
     
        })
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        Category.find()
        .populate('propertyId')
        .exec((err, data)=>{
            User.findOne({_id:user[0].id})
            .populate('cart')
            .exec(function(err,quantity){
                res.render('guest/index', { main: main, user: user,quantity:quantity,data:data, url: url })
            })
     
        })
    }
   


});
module.exports = router;
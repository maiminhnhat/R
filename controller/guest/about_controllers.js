const express = require('express');
const router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
 var Category = require("../../models/Category");
var User = require("../../models/User");
router.get('/about', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'about/about';
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
module.exports = router;
const express = require('express');
const router = express.Router();
var User = require("../../models/User");
// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
    // gọi thư viện bcrypt
// gọi thư viện bcrypt
const bcrypt = require('bcrypt');
// độ băm
const saltRounds = 10;

router.get('/profile', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'profile/profile';
    var user;
    if(localStorage.getItem('propertyGlobal') == null){
      user ==  null
    } else{
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        User.findOne({name:user[0].name})
        .exec(function(err,data){
            res.render('host/index', { main: main,data:data,user:user, url: url })
        })
    }
  
});
router.post('/api/UpdateProfile',async (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    var user =JSON.parse(localStorage.getItem('propertyGlobal'))
         var obj_update = {
                'name': name,
                'email': email,
            };
           var user = await User.findOneAndUpdate({ _id: user[0].id }, { $set: obj_update },{returnNewDocument: true}, (err, data) => {
            if (err) throw err;
                propertyGlobal = [{
                    name: data.name,
                    email: data.email,
                    id: data._id
                }];
                localStorage.setItem('propertyGlobal', JSON.stringify(propertyGlobal));
                res.send({ kq: 1, data:data })
            });
      
})
router.post('/api/changePass', async (req,res)=>{
    const new_pass = req.body.new_pass;
    var user =JSON.parse(localStorage.getItem('propertyGlobal'))
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(new_pass, salt, function(err, hash) {
           var obj_update = {
                'password': hash, 
            };
            User.updateMany({ _id: user[0].id }, { $set: obj_update }, (err, data) => {
                if (err) res.send({ kq: 0, err: err })
                res.send({ kq: 1 })
            });
        });
    });
})
module.exports = router;
const express = require('express');
const router = express.Router();
var User = require('../../models/User');
var Type = require("../../models/User_type");

// gọi thư viện bcrypt
const bcrypt = require('bcrypt');
// độ băm
const saltRounds = 10;

// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
    //login
router.get('/login', (req, res) => {
    var url = req.originalUrl.split('/');
    res.render('admin/index-login', {url: url })


});
// xử lý login
router.post('/api/processLogin', (req, res) => {
    // khai báo
    var email, password;
    // lấy dữ liệu
    email = req.body.email;
    password = req.body.password;
    // kiểm tra email
    User.find({ 'email': email })
        .exec((err, data) => {
            const hash = data[0].password
            if (err) {
                res.send({ kq: 0, err: err });
            } else {
                // kiểm tra có tồn tại trong db hay không
                if (data == '') {
                    res.send({ kq: 0, err: 'Tên đăng nhập không tồn tại.' });
                } else {
                    if (data[0].active == false) {
                        res.send({ kq: 0, err: 'Tài Khoản chưa active' })
                    }
                    else{
                        bcrypt.compare(password,hash, function(err, result) {
                          if(result == false){
                            res.send({ kq: 0, err: 'Mật khẩu không chính xác.' });
                          }
                          else{
                            propertyGlobal = [{
                                        name: data[0].name,
                                        email: data[0].email,
                                        id: data[0]._id
                                    }];
                                    // tạo 1 localstorage
                                    localStorage.setItem('propertyGlobal', JSON.stringify(propertyGlobal));
                                    var name = data[0].name
                                    var email = data[0].email
                                    var id = data[0]._id
                                    var type = data[0].role
                                    res.send({ kq: 1, name: name,type:type, email: email, id: id, message: 'Đăng nhập thành công.' });
                          }
                        });
                    }
                  
                }
            }
        });
});
module.exports = router;
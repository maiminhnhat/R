const express = require('express');
const router = express.Router();
var User = require('../../models/User');
var handlebars = require('handlebars');
var fs = require('fs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply8421@gmail.com',
        pass: 'zgmfx19a'
    }
});
// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
//login
router.get('/login', (req, res) => {
    var url = req.originalUrl;
    var main_login = 'login/main-login';
    res.render('guest/index-login', { main_login: main_login, url: url })


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
                    // kiểm tra password
                    else if (data[0].password !== password) {
                        res.send({ kq: 0, err: 'Mật khẩu không chính xác.' });
                    } else {
                        // tạo 1 localstorage


                        var name = data[0].name

                        res.send({ kq: 1, name: name, message: 'Đăng nhập thành công.' });

                    }
                }
            }
        });
});
//registers
router.get('/register', (req, res) => {
    var url = req.originalUrl;
    var main_login = 'login/main-register';
    res.render('guest/index-login', { main_login: main_login, url: url })


});
var readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};
router.post('/api/register', (req, res) => {
    // var iduser = req.body._id
    try {

        crypto.randomBytes(20, async function(err, buf) {
            // Ensure the activation code is unique.
            User.activeToken = buf.toString('hex');
            // Set expiration time is 24 hours.
            User.activeExpires = Date.now() + 24 * 3600 * 1000;
            var link = 'http://localhost:4500/active/' +
                User.activeToken;
            var obj_insert = {
                'name': req.body.name,
                'password': req.body.password,
                'email': req.body.email,
                'activeToken': User.activeToken,
                'activeExpires': User.activeExpires

            }

            const user = await User.create(obj_insert);
            readHTMLFile(__dirname + '../../../public/pages/Confirmation-Job-Site.html', function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    name: req.body.name,
                    link: link
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: 'noreply8421@gmail.com',
                    to: req.body.email,
                    subject: 'Sending Email using Node.js',
                    html: htmlToSend // nội dung email
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send('The activation email has been sent to your email, please click the activation link within 24 hours.');
                    }
                });
            })
        });


    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).send({ code: code, error: 'Email already exists' });

        }
        res.status(500).send({ code: code, error: 'Server error' });
    }
});
router.get('/active/:activeToken', (req, res, next) => {
    User.findOne({
        activeToken: req.params.activeToken,
        activeExpires: { $gt: Date.now() }

    }, (err, user) => {
        if (err) return next(err);

        // invalid activation code
        if (!user) {
            return res.render('message', {
                title: 'fail to activate',
                content: 'Your activation link is invalid, please <a href="register">register</a> again'
            });
        }
        // activate and save
        user.active = true;
        user.save(function(err, user) {
            if (err) return next(err);

            // activation success
            res.render('message', {
                title: 'activation success!',
                content: user.name + " " + 'Please <a href="login">login</a > '
            })
        })
    })
});

module.exports = router;
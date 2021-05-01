const express = require('express');
const router = express.Router();
var User = require('../../models/User');
var Type = require("../../models/User_type");
var handlebars = require('handlebars');
var fs = require('fs');
var crypto = require('crypto');
// gọi thư viện bcrypt
const bcrypt = require('bcrypt');
// độ băm
const saltRounds = 10;

var nodemailer = require('nodemailer');
const { resolveSoa } = require('dns');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    // service: 'gmail',
    auth: {
       
            type: 'OAuth2',
             user: 'noreply8421@gmail.com',
             clientId: "16491659698-5ffllu1nomqm38jh4qle8a7g3f5mchc1.apps.googleusercontent.com",
             clientSecret: "bj_OOXan8i3t7uaYQHQ2FWcL",
             refreshToken: "1//04lB1dR9XqBS5CgYIARAAGAQSNwF-L9IrDuuPN45yXArBSPPSCmsGatueAuKKh64bq_u7pi-MbiHiEFC76QN0KN-sEhINzDtgixE",
             accessToken: 'ya29.a0AfH6SMApJccmZnkUe1DMQh5XsS2VAKAOKpvH9qkEV2pHlSJ1ahQUUlmrS_vPx1-nmeoOV61cN39UuRvHekaaH8I1_CWEzPs_y9V4z_AgH0rIyPm7Tve9RsUYFGUiERA0bxvlBGAExXxCC4NWeaQxr1471jkG'
       
    }
});
// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
//login
router.get('/login', (req, res) => {
    var url = req.originalUrl.split('/');
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
            const hash = data[0].password
            if (err) {
                res.send({ kq: 0, err: err });
            } else {
                // kiểm tra có tồn tại trong db hay không
                if (data == '') {
                    res.send({ kq: 0, err: 'User is not exist' });
                } else {
                    if (data[0].active == false) {
                        res.send({ kq: 0, err: 'Your account is not active yet' })
                    }
                    else{
                        bcrypt.compare(password,hash, function(err, result) {
                          if(result == false){
                            res.send({ kq: 0, err: 'Invalid Password or Username' });
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
                                    res.send({ kq: 1, name: name,type:type, email: email, id: id, message: 'Login Successful' });
                          }
                        });
                    }
                  
                }
            }
        });
});

//registers
router.get('/register', (req, res) => {
    var url = req.originalUrl.split('/');
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
    const password = req.body.password;
   
        crypto.randomBytes(20, async function(err, buf) {
            // Ensure the activation code is unique.
            User.activeToken = buf.toString('hex');
            // Set expiration time is 24 hours.
            User.activeExpires = Date.now() + 24 * 3600 * 1000;
            var link = 'https://projecyundergraduate.herokuapp.com/active/' +
             User.activeToken;
             bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, async function(err, hash) {
                    var obj_insert = {
                        'name': req.body.name,
                        'password': hash,
                        'email': req.body.email,
                        'activeToken': User.activeToken,
                        'activeExpires': User.activeExpires
        
                    }
                    const user = await User.create(obj_insert,(err,data)=>{
                        if(err){
                            res.send({kq:0,err:err})

                        }else{
                            Type.updateOne({type:"Member"},{ 
                                "$push": { "UserId": data._id}
                            },function(err, Data) {
                                    if (err) throw err;
                                    
                            })
                            readHTMLFile(__dirname+'/../../public/pages/Confirmation-Job-Site.html', function(err, html) {
                                var template = handlebars.compile(html);
                                var replacements = {
                                    name: req.body.name,
                                    link: link
                                };
                                var htmlToSend = template(replacements);
                                var mailOptions = {
                                    from: 'noreply8421@gmail.com',
                                    to: req.body.email,
                                    subject: 'Active Your Account',
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
                        }
                       
                    });
                });
            });   
           
        });


  
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
                content: user.name + " " + 'Please <a href="https://projecyundergraduate.herokuapp.com/login">login</a > '
            })
        })
    })
});
router.post('/logout', async function(req, res) {
    localStorage.removeItem('propertyGlobal');
});
router.post('/api/ResetPassword',function(req,res){
    const email_forgot = req.body.email_forgot;
    // console.log(email_forgot)
    crypto.randomBytes(20, async function(err, buf) {
        
        // Ensure the activation code is unique.
        User.resetPasswordToken = buf.toString('hex');
        // Set expiration time is 24 hours.
        User.resetPasswordExpires = Date.now() + 24 * 3600 * 1000;
        var link = 'https://projecyundergraduate.herokuapp.com/reset/' +
        User.resetPasswordToken; 
         var obj_update = {
            'resetPasswordToken':  User.resetPasswordToken,
            'resetPasswordExpires': User.resetPasswordExpires
        }
        const user = await User.updateOne({email:email_forgot},{$set:obj_update},function(err,data){
            if (err) throw err
           
        })
        User.findOne({email:email_forgot})
        .exec(function(err,data){
            var mailOptions = {
                from: 'noreply8421@gmail.com',
                to: email_forgot,
                subject: 'Reset Your Password',
                text: `Hi ${data.name} \n 
                        Please click on the following link ${link} to reset your password. \n\n 
                        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.send('The reset link has been sent to your email, please click the reset link within 24 hours.');
                }
            });
        })
       
    
    
    });
})
router.get('/reset/:resetPasswordToken',(req,res,next)=>{
    res.render('reset_pass')
})
router.post('/reset/:resetPasswordToken',(req,res)=>{
    const new_password = req.body.new_password;
    const token =  req.body.token;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(new_password, salt, function(err, hash) {
            var obj_update = {
                'password':hash
            }
         
            User.updateOne({resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() } }, { $set: obj_update }, (err, data) => {
                if (err) res.send({ kq: 0, err: err })
             
                res.send({ kq: 1 })
            });
        });
    });

 
   
})
module.exports = router;
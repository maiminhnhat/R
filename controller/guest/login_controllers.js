const express = require('express');
const router = express.Router();
//login
router.get('/login', (req, res) => {
    var url = req.originalUrl;
    var main_login = 'login/main-login';
    res.render('guest/index-login', { main_login: main_login, url: url })


});
//registers
router.get('/register', (req, res) => {
    var url = req.originalUrl;
    var main_login = 'login/main-register';
    res.render('guest/index-login', { main_login: main_login, url: url })


});
module.exports = router;
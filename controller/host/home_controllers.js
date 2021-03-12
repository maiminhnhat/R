const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'home/main-home';
    res.render('host/index', { main: main, url: url })



});
module.exports = router;
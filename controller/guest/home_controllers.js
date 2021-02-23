const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    var url = req.originalUrl;
    var main = 'home/main-home';
    res.render('guest/index', { main: main, url: url })


});
module.exports = router;
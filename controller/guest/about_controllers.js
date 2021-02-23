const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    var url = req.originalUrl;
    var main = 'about/about';
    res.render('guest/index', { main: main, url: url })


});
module.exports = router;
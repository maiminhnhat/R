const express = require('express');
const router = express.Router();

router.get('/contact', (req, res) => {
    var url = req.originalUrl;
    var main = 'contact/contact';
    res.render('guest/index', { main: main, url: url })


});
module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/add', (req, res) => {
    var url = req.originalUrl;
    var main = 'add/add';
    res.render('host/index', { main: main, url: url })


});

module.exports = router;
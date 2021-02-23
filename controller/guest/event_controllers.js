const express = require('express');
const router = express.Router();

router.get('/event', (req, res) => {
    var url = req.originalUrl;
    var main = 'event/event';
    res.render('guest/index', { main: main, url: url })


});
router.get('/event-post', (req, res) => {
    var url = req.originalUrl;
    var main = 'event/event-post';
    res.render('guest/index', { main: main, url: url })


});
module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/event', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'event/event';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
    res.render('guest/index', { main: main, user: user, url: url })


});
router.get('/event-post', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'event/event-post';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
    res.render('guest/index', { main: main, user: user, url: url })


});
module.exports = router;
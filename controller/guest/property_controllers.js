const express = require('express');
const router = express.Router();

router.get('/property', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/main-property';
    res.render('guest/index', { main: main, url: url })

});
//house
router.get('/house', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-house';
    res.render('guest/index', { main: main, url: url })

});
//flat
router.get('/flat', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-flat';
    res.render('guest/index', { main: main, url: url })

});
//unique stay
router.get('/unique', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-unique-stay';
    res.render('guest/index', { main: main, url: url })

});
//hotel
router.get('/hotel', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-hotels';
    res.render('guest/index', { main: main, url: url })

});
router.get('/details', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/property-detail';
    res.render('guest/index', { main: main, url: url })

});
module.exports = router;
const express = require('express');
const router = express.Router();
var Property = require('../../models/Property');
var fs = require('fs');
var path = require('path');
const { MulterError } = require('multer');
//multer 
const multer = require('multer');
// cấu hình lưu file và ktra file
router.get('/add', (req, res) => {
    var url = req.originalUrl;
    var main = 'add/add';
    res.render('host/index', { main: main, url: url })
});
//get all Property
router.get('/api/properties', async(req, res) => {
    try {
        const property = await Property.find();
        return res.status(200).json({
            success: true,
            count: property.length,
            data: property
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
});
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
//add property
const upload = multer({ storage: storage }).array('input-fa[]', 10);
router.post('/uploadFile', (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            res.send(err);
        } else if (err) {
            res.send(err);
        } else {
            res.send(req.files);
        }

    });

});
router.post('/api/properties', async(req, res) => {
    try {
        const property = await Property.create(req.body);

        return res.status(201).json({
            success: true,
            data: property
        });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'This property already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }

});
module.exports = router;
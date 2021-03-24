const express = require('express');
const router = express.Router();
var User = require('../../models/User');
var handlebars = require('handlebars');
var fs = require('fs');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply8421@gmail.com',
        pass: 'zgmfx19a'
    }
});
router.get('/api/user', async(req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({
            success: true,
            count: user.length,
            data: user
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
});
var readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};
router.post('/api/user', async(req, res) => {
    // var iduser = req.body._id
    var obj_insert = {
        'name': req.body.name,
        'password': req.body.password,
        'email': req.body.email

    }
    try {
        const user = await User.create(obj_insert);
        // return res.status(201).send({
        //     success: true,
        //     data: user
        // });
        readHTMLFile(__dirname + '../../../public/pages/Confirmation-Job-Site.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name: req.body.name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'noreply8421@gmail.com',
                to: req.body.email,
                subject: 'Sending Email using Node.js',
                html: htmlToSend // nội dung email
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.send('Email sent: ' + info.response);
                }
            });
        })

    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).send({ error: 'User already exists' });
        }
        res.status(500).send({ error: 'Server error' });
    }
});
module.exports = router;
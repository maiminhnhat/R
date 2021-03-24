const express = require('express');
const router = express.Router();
var User = require('../../models/User');
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
router.post('/api/user', async (req, res) =>{
// var iduser = req.body._id
var obj_insert ={
    'name': req.body.name,
    'password': req.body.password,
    'email': req.body.email
    
}
try {
    const user = await User.create(obj_insert);
    return res.status(201).send({
        success: true,
        data: user
    });
} catch (err) {
    console.error(err);
    if (err.code === 11000) {
        return res.status(400).send({ error: 'User already exists' });
    }
    res.status(500).send({ error: 'Server error' });
}
});
module.exports = router;
const express = require('express');
const router = express.Router();
var User = require('../../models/User');

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


module.exports = router;
const express = require('express');
const router = express.Router();
var Property = require("../../models/Property");
var User = require("../../models/User");
var Category = require("../../models/Category");
router.get('/api/add_category', async function(req, res){
    try {
        const category = await Category.find();
        return res.status(200).json({
            success: true,
            count: category.length,
            data: category
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Server err' })
    }
})
router.post('/api/add_category', async(req, res) => {
try {
    const category = await Category.create(req.body);
    return res.status(201).json({
        success: true,
        data: category
    });
} catch (err) {
    console.error(err);
    if (err.code === 11000) {
        return res.status(400).json({ error: 'This category already exists' });
    }
    res.status(500).json({ error: 'Server error' });
}
});

module.exports = router;
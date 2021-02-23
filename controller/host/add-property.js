const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');


//get all Property
router.get('/', async(req, res) => {
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
})



//add property
router.post('/', async(req, res) => {
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
})
module.exports = router;
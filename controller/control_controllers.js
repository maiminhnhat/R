const express = require('express');
const router = express.Router();
//home
const home_controller = require('./guest/home_controllers');
router.use('/', home_controller);

//property
const property_controller = require('./guest/property_controllers');
router.use('/', property_controller);

//about
const about_controller = require('./guest/about_controllers');
router.use('/', about_controller);

//contact
const contact_controller = require('./guest/contact_controllers');
router.use('/', contact_controller);

//event
const event_controller = require('./guest/event_controllers');
router.use('/', event_controller);


//login&register
const login_controller = require('./guest/login_controllers');
router.use('/', login_controller);


//add-property
const add_property = require('./host/add-property');
router.use('/api/properties', add_property)
module.exports = router;
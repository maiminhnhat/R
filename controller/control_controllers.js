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

const google_controller = require('./guest/google-login_controller');
router.use('/', google_controller);
//user
const user_controller = require('./guest/user_controllers');
router.use('/', user_controller);



//home(host)
const host_home_controller = require('./host/home_controllers');
router.use('/host', host_home_controller);
//add(host)
const host_add_controller = require('./host/add_controllers');
router.use('/host', host_add_controller);
module.exports = router;
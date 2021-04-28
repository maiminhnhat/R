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

//feedback
const feedback_controller = require('./guest/feedback_controllers');
router.use('/', feedback_controller);


//login&register
const login_controller = require('./guest/login_controllers');
router.use('/', login_controller);

const google_controller = require('./guest/google-login_controller');
router.use('/', google_controller);

//payment
const payment_controller = require('./guest/payment_controllers');
router.use('/', payment_controller);


//home(host)
const host_home_controller = require('./host/home_controllers');
router.use('/manager', host_home_controller);
//profile(host)
const host_profile_controller = require('./host/profile_controller');
router.use('/manager', host_profile_controller);
//add(host)
const host_add_controller = require('./host/add_controllers');
router.use('/manager', host_add_controller);


//addCate(admin)
const category_controller = require('./admin/category_controller');
router.use('/admin', category_controller);
//addType(admin)
const type_controller = require('./admin/type_controller');
router.use('/admin', type_controller);
//viewCate(admin)
const user_admin_controller = require('./admin/user_controllers');
router.use('/admin',user_admin_controller);
//profile(host)
const admin_profile_controller = require('./admin/profile_controller');
router.use('/admin', admin_profile_controller);
//addProperty
const property_admin_controller = require('./admin/property-controller');
router.use('/admin',property_admin_controller);
//home(admin)
const admin_home_controller = require('./admin/home-controller');
router.use('/admin',admin_home_controller);
module.exports = router;



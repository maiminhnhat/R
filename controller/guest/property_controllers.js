const express = require('express');
const router = express.Router();
var Property = require("../../models/Property");

router.get('/property', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/main-property';
    //lấy toàn bộ property
    Property.find()
        .exec((err, data) => {
            var property = '';
            data.forEach(e => {
                property += ` <div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
                <div class="box_grid">
                    <figure>
                        <a href="#0" class="wish_bt"></a>
                        <a href="details"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                            <div class="read_more"><span>Read more</span></div>
                        </a>
                        <small>` + e.title + `</small>
                    </figure>
                    <div class="wrapper">
                        <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                        <h3><a href="details">` + e.title + `</a></h3>
                        <p>` + e.description + `</p>
                        <span class="price">From <strong>` + e.price + `</strong> /per person</span>
                    </div>
                    <ul>
                        <li><i class="ti-eye"></i> 164 views</li>
                        <li>
                            <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                        </li>
                    </ul>
                </div>
            </div>`
            })
            res.render('guest/index', { main: main, property: property, url: url })
        })


});
//house
router.get('/house', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-house';
    //lấy toàn bộ property
    Property.find({
            category: { '$regex': "3" }
        })
        .exec((err, data) => {
            var house = '';
            data.forEach(e => {
                house += `<div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
                <div class="box_grid">
                    <figure>
                        <a href="#0" class="wish_bt"></a>
                        <a href="details"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                            <div class="read_more"><span>Read more</span></div>
                        </a>
                        <small>` + e.title + `</small>
                    </figure>
                    <div class="wrapper">
                        <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                        <h3><a href="details">` + e.title + `</a></h3>
                        <p>` + e.description + `</p>
                        <span class="price">From <strong>` + e.price + `</strong> /per person</span>
                    </div>
                    <ul>
                        <li><i class="ti-eye"></i> 164 views</li>
                        <li>
                            <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                        </li>
                    </ul>
                </div>
            </div>`

            });
            res.render('guest/index', { main: main, house: house, url: url })
        })


});
//flat
router.get('/flat', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-flat';
    //lấy toàn bộ property
    Property.find({
            category: { '$regex': "1" }
        })
        .exec((err, data) => {
            var flat = '';
            data.forEach(e => {
                flat += `<div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
            <div class="box_grid">
                <figure>
                    <a href="#0" class="wish_bt"></a>
                    <a href="details"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                        <div class="read_more"><span>Read more</span></div>
                    </a>
                    <small>` + e.title + `</small>
                </figure>
                <div class="wrapper">
                    <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                    <h3><a href="details">` + e.title + `</a></h3>
                    <p>` + e.description + `</p>
                    <span class="price">From <strong>` + e.price + `</strong> /per person</span>
                </div>
                <ul>
                    <li><i class="ti-eye"></i> 164 views</li>
                    <li>
                        <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                    </li>
                </ul>
            </div>
        </div>`

            });
            res.render('guest/index', { main: main, flat: flat, url: url })
        })


});
//unique stay
router.get('/unique', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-unique-stay';
    //lấy toàn bộ property
    Property.find({
            category: { '$regex': "4" }
        })
        .exec((err, data) => {
            var unique = '';
            data.forEach(e => {
                unique += `<div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
        <div class="box_grid">
            <figure>
                <a href="#0" class="wish_bt"></a>
                <a href="details"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                    <div class="read_more"><span>Read more</span></div>
                </a>
                <small>` + e.title + `</small>
            </figure>
            <div class="wrapper">
                <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                <h3><a href="details">` + e.title + `</a></h3>
                <p>` + e.description + `</p>
                <span class="price">From <strong>` + e.price + `</strong> /per person</span>
            </div>
            <ul>
                <li><i class="ti-eye"></i> 164 views</li>
                <li>
                    <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                </li>
            </ul>
        </div>
    </div>`

            });
            res.render('guest/index', { main: main, unique: unique, url: url })
        })


});
//hotel
router.get('/hotel', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/list-hotels';
    //lấy toàn bộ property
    Property.find({
            category: { '$regex': "3" }
        })
        .exec((err, data) => {
            var hotel = '';
            data.forEach(e => {
                hotel += `<div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
    <div class="box_grid">
        <figure>
            <a href="#0" class="wish_bt"></a>
            <a href="details"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                <div class="read_more"><span>Read more</span></div>
            </a>
            <small>` + e.title + `</small>
        </figure>
        <div class="wrapper">
            <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
            <h3><a href="details">` + e.title + `</a></h3>
            <p>` + e.description + `</p>
            <span class="price">From <strong>` + e.price + `</strong> /per person</span>
        </div>
        <ul>
            <li><i class="ti-eye"></i> 164 views</li>
            <li>
                <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
            </li>
        </ul>
    </div>
</div>`

            });
            res.render('guest/index', { main: main, hotel: hotel, url: url })
        })

});
router.get('/details', (req, res) => {
    var url = req.originalUrl;
    var main = 'property/property-detail';
    res.render('guest/index', { main: main, url: url })

});
module.exports = router;
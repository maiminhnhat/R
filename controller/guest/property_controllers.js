const express = require('express');
const router = express.Router();
var Property = require("../../models/Property");
var User = require("../../models/User");
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
router.get('/property', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/main-property';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
    //lấy toàn bộ property
    Property.find()
        .exec((err, data) => {
            var property = '';
            data.forEach(e => {
                property += ` <div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
                <div class="box_grid">
                    <figure>
                        <a href="#0" class="wish_bt"></a>
                        <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                            <div class="read_more"><span>Read more</span></div>
                        </a>
                        <small>` + e.title + `</small>
                    </figure>
                    <div class="wrapper">
                        <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                        <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
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
            res.render('guest/index', { main: main, user: user, property: property, url: url })
        })


});
//house
router.get('/house', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-house';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
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
                        <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                            <div class="read_more"><span>Read more</span></div>
                        </a>
                        <small>` + e.title + `</small>
                    </figure>
                    <div class="wrapper">
                        <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                        <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
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
            res.render('guest/index', { main: main, user: user, house: house, url: url })
        })


});
//flat
router.get('/flat', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-flat';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
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
                    <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                        <div class="read_more"><span>Read more</span></div>
                    </a>
                    <small>` + e.title + `</small>
                </figure>
                <div class="wrapper">
                    <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                    <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
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
            res.render('guest/index', { main: main, user: user, flat: flat, url: url })
        })


});
//unique stay
router.get('/unique', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-unique-stay';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
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
                <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                    <div class="read_more"><span>Read more</span></div>
                </a>
                <small>` + e.title + `</small>
            </figure>
            <div class="wrapper">
                <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
                <h3><a href="detail/` + e._id + `s">` + e.title + `</a></h3>
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
            res.render('guest/index', { main: main, user: user, unique: unique, url: url })
        })


});
//hotel
router.get('/hotel', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-hotels';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
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
            <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                <div class="read_more"><span>Read more</span></div>
            </a>
            <small>` + e.title + `</small>
        </figure>
        <div class="wrapper">
            <div class="cat_star"><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i><i class="icon_star"></i></div>
            <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
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
            res.render('guest/index', { main: main, user: user, hotel: hotel, url: url })
        })

});
router.get('/details/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/property-detail';
    var user = JSON.parse(localStorage.getItem('propertyGlobal'));
    Property.find({ _id: req.params.id })
        .exec(function(err, data) {
            var img = data[0].image;
            var liked = data[0].liked_user
            res.render('guest/index', { main: main, user: user, liked: liked, data: data, img: img, url: url })

        })
});
router.get('/wishlist', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/wishlist';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        var error = '';
        error += `<div class="row justify-content-center text-center">
        <div class="col-xl-7 col-lg-9">
            <h2>404 <i class="icon_error-triangle_alt"></i></h2>
            <p>We're sorry, but you have to sign-in to see your wishlist.</p>
            <form>
                <div class="search_bar_error">
                    <input type="text" class="form-control" placeholder="What are you looking for?">
                    <input type="submit" value="Search">
                </div>
            </form>
        </div>
    </div>`
        res.render('guest/index', { main: main, error: error, user: user, url: url })
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        User.findOne({ _id: user[0].id }).
        populate('wishlist').
        exec(function(err, user) {
            var wish = '';
            user.wishlist.forEach(e => {
                wish += `  <div class="col-xl-4 col-lg-6 col-md-6">
            <div class="box_grid">
                <figure>
                    <a href="#0" class="wish_bt liked" type="button" id="remove"></a>
                    <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533"></a>
                    <small>` + e.title + `</small>
                    <div class="read_more"><span>Read more</span></div>
                </figure>
                <div class="wrapper">
                    <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
                    <p>` + e.description + `</p>
                    <span class="price">From <strong>` + e.price + `</strong> /per person</span>
                </div>
                <ul>
                        <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                    </li>
                </ul>
            </div>
        </div>`
            });
            res.render('guest/index', { main: main, user: user, wish: wish, url: url })
        });
    }


});


router.post('/api/ProcessWishlist', (req, res) => {
    var iduser, idproperty
    iduser = req.body.iduser;
    idproperty = req.body.idproperty;
    User.updateOne({ _id: iduser }, {
        "$push": { "wishlist": idproperty }
    }, function(err, data) {
        if (err) {
            res.send({ kq: 0, err: err })
        } else {
            res.send({ kq: 1 })
        }
    });
    Property.updateOne({ _id: idproperty }, {
        "$push": { "liked_user": iduser }
    }, function(err, data) {
        console.log(err)
    });


});
router.post('/api/RemoveWishlist', (req, res) => {
    var iduser, idproperty
    iduser = req.body.iduser;
    idproperty = req.body.idproperty;
    User.updateOne({ _id: iduser }, {
        "$pull": { "wishlist": idproperty }
    }, function(err, data) {
        if (err) {
            res.send({ kq: 0, err: err })
        } else {
            res.send({ kq: 1 })
        }
    });
    Property.updateOne({ _id: idproperty }, {
        "$pull": { "liked_user": iduser }
    }, function(err, data) {
        console.log(err)
    });
})
module.exports = router;
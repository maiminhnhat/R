const express = require("express");
const router = express.Router();
var Property = require("../../models/Property");
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
router.get("/home", (req, res) => {
    var url = req.originalUrl.split('/');
    var main = "home/main-home";
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
    }
    // console.log(user);
    //lấy toàn bộ property
    Property.find()
        .exec((err, data) => {
            var unique = data.filter(a => a.category == "4")
            var hotel = data.filter(a => a.category == "2")
            var house = data.filter(a => a.category == "3")
            var flat = data.filter(a => a.category == "1")
            var prop = '';
            data.forEach(e => {
                prop += `<div class="item">
        <div class="box_grid">
            <figure>
            
                <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                    <div class="read_more"><span>Read more</span></div>
                </a>
               
            </figure>
            <div class="wrapper">
                <h3><a href="details/` + e._id + `">` + e.title + `e</a></h3>
                <p>` + e.description + `</p>
                <span class="price">From <strong>` + e.price + `</strong> /per person</span>
            </div>
            <ul>
               
                <li>
                    <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                </li>
            </ul>
        </div>
    </div>`
            })
            res.render("guest/index", { main: main, user: user, url: url, unique: unique, house: house, flat: flat, hotel: hotel, prop: prop });
        });

});

module.exports = router;
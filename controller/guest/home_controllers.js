const express = require("express");
const router = express.Router();
var Property = require("../../models/Property");
var Category = require("../../models/Category");
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
    var prop = '';
    //lấy toàn bộ property
    Property.find()
    .exec((err, data) => {
        data.forEach(e => {
            prop += `<div class="item">
        <div class="box_grid">
            <figure>
            
                <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                    <div class="read_more"><span>Read more</span></div>
                </a>
               
            </figure>
            <div class="wrapper">
                <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
                <p>` + e.description + `</p>
                <span class="price">From <strong>` + e.price + `</strong> /per person</span>
            </div>
            <ul>
               
                <li>
                    <div class="score"><strong>` + e.rate + `</strong></div>
                </li>
            </ul>
        </div>
    </div>`
        })
       
    });
    Category.find()
    .populate('propertyId')
    .exec((err, data)=>{
        var place ='';
      data.forEach(e=>{
        e.propertyId.forEach(r=>{
            place  += `<div class="container container-custom margin_30_95 ">
            <section class="add_bottom_45 ">
                <div class="main_title_3 ">
                    <span><em></em></span>
                    <h2>`+r.category.cate_name+`</h2>
    
                </div>
                <div class="row ">
                  
                        <div class="col-xl-3 col-lg-6 col-md-6 ">
                            <a href="details/` + r._id + `" class="grid_item ">
                                <figure>
                                    <div class="score"><strong>`+r.rate+`</strong></div>
                                    <img src="/img/`+r.image[0]+`" class="img-fluid " alt=" ">
                                    <div class="info ">
                                        
                                        <h3>
                                            `+r.title+`
                                        </h3>
                                    </div>
                                </figure>
                            </a>
                        </div>
                     
                </div>
                <!-- /row -->
                <a href="`+r.category.cate_name+`"><strong>View all<i class="arrow_carrot-right "></i></strong></a>
            </section>
        </div>`;
         })
      })
        res.render("guest/index", { main: main, user: user, data: data,url: url, prop: prop,place:place});
    })

});

module.exports = router;
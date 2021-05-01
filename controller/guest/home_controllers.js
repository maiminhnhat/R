const express = require("express");
const router = express.Router();
var Property = require("../../models/Property");
var Category = require("../../models/Category");
var User = require("../../models/User");
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
router.get("/home", (req, res) => {
    var url = req.originalUrl.split('/');
    var main = "home/main-home";
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
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
                    <span class="price">From <strong>` + e.price + `$</strong> /per person</span>
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
                res.render("guest/index", { main: main, user: user, data: data, url: url, prop: prop});
        })
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
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
                    <span class="price">From <strong>` + e.price + `$</strong> /per day</span>
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
        .populate({
        path:'propertyId',
        options: {
           limit:4,
           }
        })
        .exec((err, data)=>{
                res.render("guest/index", { main: main, user: user,
                     data: data, url: url, prop: prop});       
        })
    }
});
router.post('/property/search',(req,res)=>{
    const result = req.body.result
   
    var arr= result.split(",")
    Property.find({"address":{ '$regex': arr[0] }})
    .exec((err,data)=>{
        console.log(data)
        if(data.length === 0){
        res.send({kq:0, message:"Sorry, we don't have what you are searching"})
        }else{
            var prop = '';
            data.forEach(e=>{
               prop += ` <div class="item">
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
            res.send({ kq: 1, data: prop }); 
        }
     

    })
   
})


module.exports = router;
const express = require('express');
const router = express.Router();
var Property = require("../../models/Property");
var User = require("../../models/User");
var Comment = require("../../models/Comment");
var Category = require("../../models/Category");
var Cart = require("../../models/Cart");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
router.get('/property(/:page)?', async (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/main-property';
    var user;
    var limit, skip, totalData, page;
    totalData = await Property.find();
    totalData = totalData.length;
    limit = 3;
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        var totalPage = Math.ceil(totalData / limit);
        var property = '';
        //lấy toàn bộ property
        Property.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, data) => {
            data.forEach(e => {
                property += ` <div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
                <div class="box_grid" id="box_grid">
                    <figure>
                    
                        <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                            <div class="read_more"><span>Read more</span></div>
                        </a>
                        <small>` + e.title + `</small>
                    </figure>
                    <div class="wrapper">
                        <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
                        <p>` + e.description + `</p>
                        <span class="price">From <strong>` + e.price + `$</strong> /per day</span>
                    </div>
                    <ul>
                        <li>
                            <div class="score"><span><em>` + e.comment.length + ` Reviews</em></span><strong>` + e.rate + `</strong></div>
                        </li>
                    </ul>
                </div>
            </div>`
            })
            
        })
        Category.find()
        .populate('propertyId')
        .exec((err, data)=>{
          res.render('guest/index', { main: main, user: user, data:data, property: property, url: url,page: page, totalPage: totalPage })    
        })
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
           // tổng số trang
        var totalPage = Math.ceil(totalData / limit);
        var property = '';
        //lấy toàn bộ property
        Property.find()
            .sort({ _id: -1 })
            .limit(limit)
            .skip(skip)
            .exec((err, data) => {
                data.forEach(e => {
                    property += ` <div class="col-xl-4 col-lg-6 col-md-6 isotope-item popular">
                    <div class="box_grid" id="box_grid">
                        <figure>
                        
                            <a href="details/` + e._id + `"><img src="img/` + e.image[0] + `" class="img-fluid" alt="" width="800" height="533">
                                <div class="read_more"><span>Read more</span></div>
                            </a>
                            <small>` + e.title + `</small>
                        </figure>
                        <div class="wrapper">
                            <h3><a href="details/` + e._id + `">` + e.title + `</a></h3>
                            <p>` + e.description + `</p>
                            <span class="price">From <strong>` + e.price + `$</strong> /per day</span>
                        </div>
                        <ul>
                            <li>
                                <div class="score"><span><em>` + e.comment.length + ` Reviews</em></span><strong>` + e.rate + `</strong></div>
                            </li>
                        </ul>
                    </div>
                </div>`
                })
                
            })
            Category.find()
            .populate('propertyId')
            .exec((err, data)=>{
              
           res.render('guest/index', { main: main, user: user, data:data, property: property, url: url,page: page, totalPage: totalPage })
             
            
            })
    }
  

});
//house
router.get('/House(/:page)?', async (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-house';
    var user;
    var limit, skip, totalData, page;
    totalData = await Category.findOne({name: {'$regex': 'House'}});
    totalData = totalData.propertyId.length;
    limit = 6;
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
        Category.find()
            .populate('propertyId')
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skip)
            .exec((err, data) => {
                 var house = data.filter(c => c.name == 'House' )
                 res.render('guest/index', { main: main, user: user, data:data, house: house, url: url,page: page, totalPage: totalPage })
            })
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
        Category.find()
            .populate('propertyId')
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skip)
            .exec((err, data) => {
                 var house = data.filter(c => c.name == 'House' )
                    res.render('guest/index', { main: main, user: user, data:data, house: house, url: url,page: page, totalPage: totalPage })
                 
     
            })
    }
  


});
//flat
router.get('/Flat(/:page)?', async (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-flat';
    var user;
    var limit, skip, totalData, page;
    totalData = await Category.findOne({name: {'$regex': 'Flat'}});
    totalData = totalData.propertyId.length;
   
    limit = 6;
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
        Category.find()
        .populate('propertyId')
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
        .exec((err, data) => {
            var flat = data.filter(c => c.name == 'Flat' )
            res.render('guest/index', { main: main, user: user, data:data,flat: flat, url: url,page: page, totalPage: totalPage })             
       });
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
        Category.find()
        .populate('propertyId')
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
        .exec((err, data) => {
            var flat = data.filter(c => c.name == 'Flat' )
           
                res.render('guest/index', { main: main, user: user, data:data, flat: flat, url: url,page: page, totalPage: totalPage })

            
        });
  
    }
 

});
//unique stay
router.get('/Unique(/:page)?', async (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-unique-stay';
    var user;
    var limit, skip, totalData, page;
    totalData = await Category.findOne({name: {'$regex': 'Unique'}});
    totalData = totalData.propertyId.length;
   
    limit = 6;
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
        Category.find()
            .populate('propertyId')
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skip)
            .exec((err, data) => {
                var unique = data.filter(c => c.name == 'Unique' )
              res.render('guest/index', { main: main, user: user, data:data, unique: unique, url: url,page: page, totalPage: totalPage });
            });
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
        Category.find()
            .populate('propertyId')
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skip)
            .exec((err, data) => {
                var unique = data.filter(c => c.name == 'Unique' )
               
                    res.render('guest/index', { main: main, user: user, data:data, unique: unique, url: url,page: page, totalPage: totalPage })
               
               
            });
    }



});
//hotel
router.get('/Hotel(/:page)?',async (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/list-hotels';
    var user;
    var limit, skip, totalData, page;
    totalData = await Category.findOne({name: {'$regex': 'Hotel'}});
    totalData = totalData.propertyId.length;
    limit = 6;
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
      
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
      Category.find()
      .populate('propertyId')
      .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
      .exec((err, data) => {
        var hotel = data.filter(c => c.name == 'Hotel' )
         res.render('guest/index', { main: main, user: user, data:data, hotel: hotel, url: url,page: page, totalPage: totalPage })
      });
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        var totalPage = Math.ceil(totalData / limit);
        //lấy toàn bộ property
      Category.find()
      .populate('propertyId')
      .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
      .exec((err, data) => {
        var hotel = data.filter(c => c.name == 'Hotel' )
       
            res.render('guest/index', { main: main, user: user, data:data, hotel: hotel, url: url,page: page, totalPage: totalPage })
      
       
      });
    }
      

});

router.get('/details/:id', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'property/property-detail';
    var user;
    var user_id;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null;
      
        user_id = 0;
        Comment.aggregate([{
                    $match: { property: ObjectId(req.params.id) }
                },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 }
                    }

                }
            ])
            .exec((err, Data) => {
                var count = Data.sort((a, b) => parseFloat(b._id) - parseFloat(a._id))
                var rate = '';
                count.forEach(e => {
                    rate += `<div class="row">
            <div class="col-lg-10 col-9">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ` + e.count + `%" aria-valuenow="` + e.count + `" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col-lg-2 col-3"><small><strong>` + e._id + ` stars</strong></small></div>
        </div>`;
                })
                Property.find({ _id: req.params.id })
                    .populate('comment')
                    .exec(function(err, data) {
                        var Comment = JSON.parse(JSON.stringify(data[0].comment));
                        var str = '';
                        Comment.forEach(e => {
                            str += `    <div class="review-box clearfix">
                <div class="rev-content">
                    <div class="rev-info">
                    ` + e.username + `
                    </div>
                    <div class="rev-text">
                        <p>
                        ` + e.comment + `
                        </p>
                    </div>
                </div>
            </div>`;
                        })
                        var img = data[0].image;
                        var liked = data[0].liked_user
                        var liked_id = liked.toString()
                        Category.find()
                        .populate('propertyId')
                        .exec((err, menu)=>{
                           res.render('guest/index', { main: main, user: user,menu:menu, rate: rate, str: str, liked_id: liked_id, user_id: user_id, data: data, img: img, url: url })
                       
                     
                        })
                      
                    })


            })

    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        user_id = user[0].id
        Comment.aggregate([{
                    $match: { property: ObjectId(req.params.id) }
                },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 }
                    }

                }
            ])
            .exec((err, Data) => {
                var count = Data.sort((a, b) => parseFloat(b._id) - parseFloat(a._id))
                var rate = '';
                count.forEach(e => {
                    rate += `   <div class="row">
                    <div class="col-lg-10 col-9">
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ` + e.count + `%" aria-valuenow="` + e.count + `" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-3"><small><strong>` + e._id + ` stars</strong></small></div>
                </div>`;
                })
                Property.find({ _id: req.params.id })
                    .populate('comment')
                    .exec(function(err, data) {
                        var Comment = JSON.parse(JSON.stringify(data[0].comment));
                        var str = '';
                        Comment.forEach(e => {
                            str += `<div class="review-box clearfix">
                        <div class="rev-content">
                            <div class="rev-info">
                            <p id="username"> ` + e.username + `</p>
                           
                            </div>
                            <div class="rev-text">
                                <p id="comment" >
                                ` + e.comment + `
                                </p>
                            </div>
                        </div>
                    </div>`;
                        })
                        var img = data[0].image;
                        var liked = data[0].liked_user
                        var liked_id = liked.toString()
                        Category.find()
                        .populate('propertyId')
                        .exec((err, menu)=>{
                         res.render('guest/index', { main: main, user: user, menu:menu, rate: rate, str: str, liked_id: liked_id, user_id: user_id, data: data, img: img, url: url })

                        })
                     
                       
                    })


            })


    }

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
          
        </div>
    </div>`
    Category.find()
    .populate('propertyId')
    .exec((err, data)=>{
 res.render('guest/index', { main: main, error: error,data:data, user: user, url: url })
       
 
    })
        
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        User.findOne({ _id: user[0].id }).
        populate('wishlist').
        exec(function(err, user_wish) {
            var wish = '';
            user_wish.wishlist.forEach(e => {
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
                    <span class="price">From <strong>` + e.price + `</strong> /per day</span>
                </div>
                <ul>
                        <div class="score"><span><em>` + e.comment.length + ` Reviews</em></span><strong>` + e.rate + `</strong></div>
                    </li>
                </ul>
            </div>
        </div>`
            });
            Category.find()
            .populate('propertyId')
            .exec((err, data)=>{
               res.render('guest/index', { main: main, user: user,data:data, wish: wish, url: url })
                
         
            })
          
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
router.post('/api/processComment',async (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var rating = req.body.rating;
    var idproperty = req.body.idproperty;
    var text = req.body.text;
    var obj_insert = {
        'username': username,
        'email': email,
        'rating': rating,
        'property': idproperty,
        'comment': text
    }
    try { 
        Comment.find()
        .exec(async function(err,data){
         data.forEach(e=>{
             if(e.property ==idproperty ){
                res.status(400).send({ code: code, error: 'You already review' });
             }else{
                const comment = await Comment.create(obj_insert,(err,data)=>{
                    res.send({ kq: 1 })
                    Property.updateOne({ _id: idproperty }, {
                        "$push": { "comment": data._id }
                    }, function(err, data) {
                        if (err) throw err;
                    })
                    Comment.aggregate([{
                                $group: {
                                    _id: "$property",
                                    avg: { $avg: "$rating" },
                                    count: { $sum: 1 }
                                }
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    avg: { $round: ['$avg', 1] },
                                    count: "$count"
                                }
                            },
        
                        ])
                        .exec(function(err, data) {
                            Property.updateOne({ _id: data[0]._id }, { $set: { rate: data[0].avg } }, function(err, data) {
                                if (err) throw err;
                            })
                        });
                });
             }
         })
        })
       
   
    } catch (err) {
        console.error(err)
        res.status(500).send({ code: code, error: 'Server error' });
    }
    // Comment.create(obj_insert, (err, data) => {
    //     else if(err){
           
    //     }
    //      else {
            

    //     }

    // });
});

router.get('/checkout', (req, res)=>{
    var url = req.originalUrl.split('/');
    var main = 'cart/checkout';
    var user;
    if (localStorage.getItem('propertyGlobal') == null) {
        user = null
    } else {
        user = JSON.parse(localStorage.getItem('propertyGlobal'));
        Cart.aggregate([{
            $match: {  $and:[{user: ObjectId(user[0].id)}, {state:"pending"}]}
        },
        {
            $group: {
                _id: '',
                total: { $sum: '$price' }
            }
         }, {
            $project: {
                _id: 0,
                total: '$total'
            }
    
        }
    ]).exec(function(err, Data){
        if (err) throw err
        User.findOne({_id: user[0].id})
            .populate('cart')
            .exec(function(err, user_cart){
                var cart_detail ='';
                user_cart.cart.forEach(e=>{
                cart_detail += `<div id="property-name" style="color: white;
                font-size: 33px;
                text-align: center;
                text-transform: uppercase;
                font-weight: 400;
                border: 0;
                padding-top: 0;">
                `+e.item+`
            </div>
            <ul class="cart_details">
                <li>From <span>`+e.cart_details.date+`</span></li>
                <li>Adults <span>`+e.cart_details.adults+`</span></li>
                <li>Childs <span>`+e.cart_details.children+`</span></li>
                <li>Room Type <span>`+e.cart_details.room+`</span></li>
            </ul>
            `
            
                })
                Category.find()
                .populate('propertyId')
                .exec((err, data)=>{
                   
                        res.render("guest/index", { main: main, user: user,user_cart:user_cart, data: data,Data:Data, cart_detail: cart_detail,url: url});
                  
               
                })
        
            })
          
    })
    } 
})
router.post('/api/ProcessAddCart',(req, res)=>{
    //tính số tiền
    function DayCal(date){
        var months = ["Jan","Feb","March","April","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]
        var arr = date.split(" > ");
          var arr1= [];
          arr.forEach(e=>{
            const splitDateString = e.split("-")
            var monthNum = parseInt(splitDateString[0],10);
            var actualMonth =  months[monthNum - 1] 
            var newMonth =` ${actualMonth}-${splitDateString[1]}-${splitDateString[2]}`
            var Day = new Date(newMonth)
            var Time = Day.getTime()
            arr1.push(Time)
            
          })
          var dayNum = (arr1[1] - arr1[0])/8.64e+7
          return dayNum
      }
    var idproperty = req.body.idproperty
    var iduser = req.body.iduser
    const date = req.body.date
    var adults = req.body.adults
    var children = req.body.children
    var room = req.body.room
    var Day = DayCal(date)
    Property.find({ _id: idproperty})
    .exec(function(err, data) {
        if(err) throw err;
     data.forEach(e=>{
        var obj_insert ={
            'item':e.title,
            'price':e.price * Day,
            'cart_details':{
                'date': date,
                'adults': adults,
                'children':children,
                'room':room
            },
            'user': iduser
        }
        Cart.create(obj_insert, (err, data)=>{
            console.error(err)
            if(err){
                res.send({kq:0,err:err})
            }
            else{
                res.send({kq:1, data:data});
                localStorage.setItem('CartID',data._id)   
                User.updateOne({ _id: iduser }, {
                    "$push": { "cart": data._id }
                }, function(err, data) {
                    if(err) throw err
                });
            }
        })
     })
     
    })
})

module.exports = router;
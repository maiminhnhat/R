const express = require('express');
const router = express.Router();
var Cart = require("../../models/Cart");
var Property = require("../../models/Property");
var User = require("../../models/User");
var Comment = require("../../models/Comment");
var Feedback = require("../../models/Feedback")
router.get('/home', (req, res) => {
    var url = req.originalUrl.split('/');
    var main = 'home/main-home';
    Cart.find()
    .sort({$natural:-1})
    .exec(function(err,cart){
      Comment.find()
      .sort({$natural:-1})
      .exec(function(err,comment){
          Property.find()
          .sort({$natural:-1})
          .exec(function(err,property){
              User.find()
          .exec(function(err,data){
              var str = '';
              data.forEach(e => {
                  str += `
                  <tr>
                  <td>`+e.name+`</td>
                  <td>`+e.role+`</td>
                  <td>`+e.email+`</td>   
                  <td>`+e.active+`</td>
                  <td>
                  <div class="modal fade" role="dialog" tabindex="-1" id="MyModal">
                      <div class="modal-dialog" role="document">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <h4 class="modal-title">ATTENTION!!!!</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                              </div>
                              <div class="modal-body">
                                  <p>Are you sure?</p>
                              </div>
                              <div class="modal-footer"><button class="btn btn-light" type="button" data-dismiss="modal">No</button><a href="deleteUser/` + e._id + `" class="btn btn-primary">Delete</a></div></div>
                          </div>
                      </div>
                  </div><a class="btn btn-primary" href="editUser/` + e._id + `" role="button" style="background: var(--teal);"><i class="fa fa-plus"></i>&nbsp;Update</a>&nbsp; &nbsp;<button class="btn btn-primary" type="button" style="background: var(--danger);"
                      data-toggle="modal" data-target="#MyModal"><i class="fa fa-trash-o"></i>&nbsp;Delete</button>
              </td>
                  </tr>
                  `;

              });
              Feedback.find()
              .sort({$natural:-1})
              .exec(function(err,feedback){
                  res.render('host/index', { main: main,comment:comment,feedback:feedback,property:property,str:str,cart:cart,url: url })
              })
           })
           })
       })
    })
});
router.get('/booking(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'listing/booking';
    totalData = await Cart.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    Cart.find()
    .populate('user')
    .sort({ _id: 1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err,data){
        var str ='';
        var totalPage = Math.ceil(totalData / limit);
        data.forEach(e=>{
        
            var people = e.cart_details.adults + e.cart_details.children;
            str += `<li>
            <h4>`+e.item+` <i class="pending">`+e.state+`</i></h4>
            <ul class="booking_list">
                <li><strong>Date</strong>`+e.cart_details.date+`</li>
                <li><strong>Booking details</strong>`+people+` People</li>
                <li><strong>Client</strong>`+e.user.name+`</li>
            </ul>
        </li>`
        })
        res.render('host/index', { main: main,str:str,url: url,page: page, totalPage: totalPage })
    })
})
router.get('/pending(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'listing/pending';
    totalData = await Cart.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    Cart.find()
    .populate('user')
    .sort({ _id: 1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err,data){
        var totalPage = Math.ceil(totalData / limit);
        var pending = data.filter(p=> p.state =="pending")
        res.render('host/index', {main: main,pending:pending,url: url,page: page, totalPage: totalPage})
    })
})
router.get('/completed(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'listing/completed';
    totalData = await Cart.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    Cart.find()
    .populate('user')
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err,data){
        var completed = data.filter(p=> p.state =="completed")
        var totalPage = Math.ceil(totalData / limit);
        res.render('host/index', {main: main,completed:completed,url: url,page: page, totalPage: totalPage })
    })
})
router.get('/review(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'listing/review';
    totalData = await Cart.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    Comment.find()
    .populate('property')
    .sort({ _id: 1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err,data){
        var str ='';
        var totalPage = Math.ceil(totalData / limit);
        data.forEach(e=>{
        
            str += `<li>
            
            <span class="rating">`+e.rating+`</span>
            <h4>`+e.property.title+` <small>by `+e.username+`</small></h4>
            <p>`+e.comment+`</p>
            
        </li>`
        })
        res.render('host/index', { main: main,str:str,url: url,page: page, totalPage: totalPage })
    })
})
router.get('/refunded(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'listing/refunded';
    totalData = await Cart.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    Cart.find()
    .populate('user')
    .sort({ _id: 1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err,data){
        var refunded = data.filter(p=> p.state =="refunded")
        var totalPage = Math.ceil(totalData / limit);
        res.render('host/index', {main: main,refunded:refunded,url: url,page: page, totalPage: totalPage })
    })
})
router.get('/feedback(/:page)?',async (req,res)=>{
    var url = req.originalUrl.split('/');
    var main = 'listing/feedback';
    totalData = await Feedback.find();
    totalData = totalData.length;
    limit = 3
    page = req.params.page;
    if (page == undefined) {
        skip = 0;
    } else {
        skip = (page - 1) * limit;
    }
    Feedback.find()
    .populate('user')
    .sort({ _id: 1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err,data){
        var str ='';
        var totalPage = Math.ceil(totalData / limit);
        data.forEach(e=>{
            str += `<li>
            <h4>`+e.username+`</h4>
            <p>`+e.feeback+`</p>
        </li>`
        })
        res.render('host/index', { main: main,str:str,url: url,page: page, totalPage: totalPage })
    })
})
router.post('/logout', function(req, res) {
    localStorage.removeItem('propertyGlobal');
});
module.exports = router;
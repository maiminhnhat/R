const stripe = require('stripe')('sk_test_51Ig3TKHDgdUfZ7e85fEUjjkxmh3QGxEchgexhf52AQYSpCi6176fe7tuIHytxLtmky3eCF27H4Q4Ue7drlgoyApp00vcQ3dvDn');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
var Cart = require("../../models/Cart");
var User = require("../../models/User");
var Category = require("../../models/Category");

router.post('/charge', async (req, res)=>{
    // console.log(req.body.email)
    var url = req.originalUrl.split('/');
    var main ='cart/success';
    var email = req.body.email;
    var user = JSON.parse(localStorage.getItem('propertyGlobal'));
    const token = await stripe.tokens.create({
        card: {
          number:req.body.card_number,
          exp_month:req.body.expire_month,
          exp_year: req.body.expire_year,
          cvc: req.body.ccv,
        },
      });
    Cart.aggregate([{
        $match: { user: ObjectId(user[0].id) }
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
]).exec(function(err, data){
    if(err) throw err
  const amount = (data[0].total)*1000
  stripe.customers.create({
      email:email,
      source:token.id
  })
  .then(customer =>stripe.charges.create({
     amount: amount,
     description:'Panagea booking',
     currency: 'usd',
     customer: customer.id
  }))
  .then(charge => Category.find()
  .populate('propertyId')
  .exec((err, data)=>{
   res.render("guest/index", { main: main,data:data, user: user, email:email,url: url});
  }));
})
   

})
module.exports = router;
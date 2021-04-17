const stripe = require('stripe')('sk_test_51Ig3TKHDgdUfZ7e85fEUjjkxmh3QGxEchgexhf52AQYSpCi6176fe7tuIHytxLtmky3eCF27H4Q4Ue7drlgoyApp00vcQ3dvDn');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const paypal = require('paypal-rest-sdk');
const ObjectId = mongoose.Types.ObjectId;
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
var Cart = require("../../models/Cart");
var Category = require("../../models/Category");
var User = require("../../models/User");
// STRIPE API PAYMENT
 router.get('/success', function (req, res){
    var url = req.originalUrl.split('/');
    var main ='cart/success';
    var user = JSON.parse(localStorage.getItem('propertyGlobal'));
    var email =user[0].email;
    Category.find()
  .populate('propertyId')
  .exec((err, data)=>{
    User.findOne({_id:user[0].id})
    .populate('cart')
    .exec(function(err,quantity){
        res.render("guest/index", { main: main, data:data, quantity:quantity, user: user, email:email, url: url});
    })
    })
  
 })
router.post('/api/charge', async (req, res)=>{
    // console.log(req.body.email)
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
  const amount = (data[0].total)*100
  stripe.customers.create({
      email:email,
      source:token.id
  })
  .then(customer =>stripe.charges.create({
     amount: amount,
     description:'Panagea booking',
     currency: 'usd',
     customer: customer.id,
  }))
  .then(User.updateOne({_id:user[0].id},{
    $set:{cart: []}
}, function(err, data) {
    if(err) throw err
}))
.then(Cart.deleteMany({user:user[0].id},function(err,data){
    if(err) throw err
}))
 .then(res.send({kq:1}))
})
});
// PAYPAL API PAYMENT
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Ae3q6n9_cGmJqR2D1-KGp8KLCKFHEs-zM7UiNxDuH34RbafMMvjEX_j_0TTlG-E5Q_8r0Sy0Pm_wfMh9',
  'client_secret': 'EJfE21ykMWV-zJLMwsNJ2kKv_XRlo1Bb_o8axYHY1yPg49tSMS9RdNIFBPO-ymSVQLdgj1z5-b8yrazi'
});
router.post('/api/paypal',(req,res)=>{
    var user = JSON.parse(localStorage.getItem('propertyGlobal'));
    User.findOne({_id:user[0].id})
    .populate('cart')
    .exec(function(err,order){
        var Order = JSON.parse(JSON.stringify(order.cart))
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
    ]).exec(function(err,data){
        const Amount = data[0].total.toFixed(2)
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:4500/success",
                "cancel_url": "http://localhost:4500/cart"
            },
            "transactions": [
                {
                    "amount": {
                        "currency": "USD",
                        "total":Amount,
                        "details": {
                            "subtotal":Amount
                        }
                    },
                    "item_list": {
                        "items": Order.map((item)=>{
                            return {
                                name: item.item,
                                sku: "123",
                                price: parseFloat(item.price).toFixed(2),
                                currency: "USD",
                                quantity: "1"
                              }
                        })
                    },
                    "description": "Payment description"
                }
            ]
            }
            console.log(create_payment_json.transactions[0].item_list)
            paypal.payment.create(create_payment_json, function(err,payment){
            if(err){
                throw err
            } else{
              console.log("Create Payment Successfully")
              console.log(payment)
               res.send("Test")
            }
         })
         
    })
    })
  

       
  
})
module.exports = router;
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
  },function(err,data){
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
      Cart.updateMany({createdAt:{$gte:today.toISOString().substring(0, 10)}},{$set:{state:"completed",payment_id:data.id,payment:"Visa"}},function(err,data){
        if(err) throw err
    })
  }))
  .then(User.updateOne({_id:user[0].id},{
    $set:{cart: []}
}, function(err, data) {
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
            $match: { $and:[{user: ObjectId(user[0].id)}, {state:"pending"}] }
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
                "return_url": "http://localhost:4500/paypal/success",
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
                    "description": "Panagea booking"
                }
            ]
            }
            // console.log(create_payment_json.transactions[0].item_list)
            paypal.payment.create(create_payment_json, function(err,payment){
            if(err){
                throw err
            } else{
                for(let i = 0;i < payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                      res.redirect(payment.links[i].href);
                    }
                  }
                }
         })
         
    })
    })
  
router.get('/paypal/success',(req,res)=>{
    var url = req.originalUrl.split('/');
    var main ='cart/success_paypal';
    var user = JSON.parse(localStorage.getItem('propertyGlobal'));
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId; 
      Cart.aggregate([{
        $match: {  $and:[{user: ObjectId(user[0].id)}, {state:"pending"}] }
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
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": Amount
            }
        }]
      };
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);
              Cart.updateMany({createdAt:{$gte:today.toISOString().substring(0, 10)}},{$set:{state:"completed",payment_id:payment.transactions[0].related_resources[0].sale.id,payment:"Paypal"}},function(err,data){
                if(err) throw err
            })
            Category.find()
            .populate('propertyId')
            .exec((err, data)=>{
              User.findOne({_id:user[0].id})
              .populate('cart')
              .exec(function(err,quantity){
                  res.render("guest/index", { main: main, data:data, quantity:quantity, user: user, url: url});
              })
              })
              User.updateOne({_id:user[0].id},{
                $set:{cart: []}
            }, function(err, data) {
                if(err) throw err
            })
           
        }
    });
})

})  
})
router.get('/history',(req,res)=>{
    var url = req.originalUrl.split('/');
    var main ='cart/history';
    var user;
 if (localStorage.getItem('propertyGlobal') == null) {
     user == null
     var error = '';
     error += `<div class="row justify-content-center text-center">
     <div class="col-xl-7 col-lg-9">
         <h2>404 <i class="icon_error-triangle_alt"></i></h2>
         <p>We're sorry, but you have to sign-in to see your cart.</p>
      
     </div>
 </div>`
        Category.find()
        .populate('propertyId')
        .exec((err, data)=>{
        res.render("guest/index", { main: main,data:data, user: user,error:error,url: url});
        })
 }else{
    user = JSON.parse(localStorage.getItem('propertyGlobal'));
    Cart.find({ $and:[{user:user[0].id}, {state:"completed"}]})
    .exec(function(err,user_cart){
        var history ='';
      user_cart.forEach(e=>{
          history += `<tbody>
          <tr>
          <td>
                  <span class="item_cart">`+e.payment_id+`</span>
              </td>
              <td>
                  <span class="item_cart">`+e.state+`</span>
              </td>
          <td>
                  <strong>`+e.payment+`</strong>
              </td>
              
              <td>
                  <strong>`+e.price+`</strong>
              </td>
              <td class="options" style="width:5%; text-align:center;">
              <form action="/api/paypal_refund"  method="POST">
              <button type="submit" class="btn_1 outline">Refund</button>
             </form>
            
              </td>
          </tr>
      
          </tr>
      </tbody>`;

      })
      Category.find()
      .populate('propertyId')
      .exec((err, data)=>{
        User.findOne({_id:user[0].id})
        .populate('cart')
        .exec(function(err,quantity){
            res.render("guest/index", { main: main, data:data, quantity:quantity, history:history, user: user,  url: url});
        })
        })

    })
  
    

 }
   
})
router.post('/api/paypal_refund',(req,res)=>{
    var user = JSON.parse(localStorage.getItem('propertyGlobal'));
    Cart.aggregate([{
        $match: {  $and:[{user: ObjectId(user[0].id)}, {state:"pending"}] }
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
    var refund_details = {
        "amount": {
            "currency": "USD",
            "total": Amount
        }
    };
    Cart.findOne({user:user[0].id})
    .exec(function(err,data){
        paypal.sale.refund(data.payment_id, refund_details, function (error, refund) {
            if (error) {
                console.error(error);
            } else {
                if (error) {
                    throw error;
                } else {
                    console.log("Refund Sale Response");
                    console.log(refund);
                }
            }
        });
    })

})
    
})
module.exports = router;
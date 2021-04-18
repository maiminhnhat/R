// gọi mongoose
const mongoose = require('mongoose');
 const SchemaCart = new mongoose.Schema({
  item:{
         type:String
     },
   price:{
    type:Number
   },
   cart_details:{
     date:String,
     adults: Number,
     children: Number,
     room:String
   },
   state:{
       type:String,
       default:"pending"
   },
   payment_id:String,
   payment:String,
   user:{
    type: mongoose.Schema.Types.ObjectId,
     ref:"User"
   },
   createdAt: {
    type: Date,
    default: Date.now
}

 });
 module.exports = mongoose.model('Cart', SchemaCart);
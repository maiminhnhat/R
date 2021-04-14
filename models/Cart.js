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
   user:{
    type: mongoose.Schema.Types.ObjectId,
     ref:"User"
   }

 });
 module.exports = mongoose.model('Cart', SchemaCart);
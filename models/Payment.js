// gọi mongoose
const mongoose = require('mongoose');
 const SchemaPayment = new mongoose.Schema({
   sale_id:String,
   state:String,
   payment:String
 });
 
 module.exports = mongoose.model('Payment', SchemaPayment);
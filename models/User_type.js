// gọi mongoose
const mongoose = require('mongoose');
 const SchemaType = new mongoose.Schema({
     type:{
         type:String,
         required:true
     },
   UserId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
     }]
 });
 module.exports = mongoose.model('Type', SchemaType);
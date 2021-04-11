// gọi mongoose
const mongoose = require('mongoose');
 const SchemaCategory = new mongoose.Schema({
     name:{
         type:String,
         required:true
     },
     propertyId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
     }]
 });
 module.exports = mongoose.model('Category', SchemaCategory);
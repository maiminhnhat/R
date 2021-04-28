// gọi mongoose
const mongoose = require('mongoose');
 const SchemaFeedback= new mongoose.Schema({
     username:{
         type:String,
          ref:"user"
     },
     feeback:{
        type: String,
        
     }
 });
 module.exports = mongoose.model('Feedback', SchemaFeedback);
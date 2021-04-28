// gọi mongoose
const mongoose = require('mongoose');
const SchemaComment = new mongoose.Schema({
    username: {
        type: String,
        ref: "user",
    },
    email: {
        type: String,
       
        ref: "user",
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        unique: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: String

});
module.exports = mongoose.model('Comment', SchemaComment);
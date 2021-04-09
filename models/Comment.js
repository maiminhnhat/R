// gọi mongoose
const mongoose = require('mongoose');
const SchemaComment = new mongoose.Schema({
    username: {
        type: String,
        ref: "User",
    },
    email: {
        type: String,
        unique: true,
        ref: "User",
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",

    },
    rating: {
        type: Number,
        default: 0
    },
    comment: String

});
module.exports = mongoose.model('Comment', SchemaComment);
// gọi mongoose
const mongoose = require('mongoose');
// 1. schema : giúp tạo cấu trúc
const schemaUser = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    role: {
     type: String,
     default: "Member",
     ref: "User_type"
      
    },
    active: {
        type: Boolean,
        default: 0
    },
    activeToken: String,
    activeExpires: Date,
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    status: {
        type: Boolean,
        default: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",

    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",

    }]
});

// 2. model : tạo collection
module.exports = mongoose.model('user', schemaUser);
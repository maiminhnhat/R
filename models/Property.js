const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const PropertySchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },

    category: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Category"
          },
          cate_name:String,
      
    },
    description: String,
    image: [String],
    price: {
        type: String,
        required: true
    },

    location: {
        type: {
            type: Number,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'

        },
        formattedAddress: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    liked_user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",

    }],
    rate: {
        type: Number,
        default: 0
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]

});
// Geocode & create location
PropertySchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress
    };

    next();
});

module.exports = mongoose.model('Property', PropertySchema);
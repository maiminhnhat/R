const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const PropertySchema = new mongoose.Schema({
    propertyId: {
        type: String,
        required: [true, 'Please add a ID'],
        unique: true,
        trim: true,
        maxlength: [10, 'ID must be less than 10 chars']
    },
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
        type: Array,
        default: 0,
        required: true
            //0:false, 1:true
    },
    description: String,
    price: {
        type: String,
        required: true
    },

    location: {
        type: {
            type: String,
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
    }
});
// Geocode & create location
PropertySchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress
    };


    // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Property', PropertySchema);
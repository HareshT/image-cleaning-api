'use strict';

var Mongoose = require('mongoose');

var imagesModelSchema = new Mongoose.Schema({
    imgName: {
        type: String,
        required: true
    },
    imgPath: {
        type: String,
        required: true
    },
    imgPoint: {
        type: Number,
        default: false
    },
    imgArcPath : {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

imagesModelSchema.index(
    {
        _id: 1,
        enabled: 1
    }
);

module.exports = Mongoose.model('images', imagesModelSchema);


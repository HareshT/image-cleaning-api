'use strict';

var Mongoose = require('mongoose');

var userSchema = new Mongoose.Schema({
    name: {type: String},
    surName: {type: String}
});

//userSchema.index(
//    {
//        _id: 1,
//        enabled: 1
//    }
//);

module.exports = Mongoose.model('TestUsers', userSchema);


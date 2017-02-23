'use strict';
var debug         = require('debug')('imageCleaning:testServices');
var Boom          = require('boom');
var _             = require('lodash');

var UserModel   = require('../models/TestUserModel');

exports.validateUser = function (req, res, next) {
    debug('inside validate user');
    var params = req.body;
    debug('params %o',req.body);

    if (_.isEmpty(params.name)) {
        return next(new Boom.notFound('Invalid userName'));

    } else if (_.isEmpty(params.surName)) {
        return next(new Boom.notFound('Invalid  surName'));
    }
   return next();
};
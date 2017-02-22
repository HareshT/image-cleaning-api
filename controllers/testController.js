'use strict';

var debug = require('debug')('imageCleaning: testController');
var userModel = require('../models/testUserModel');
var Boom = require('boom');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');

exports.addUser = function (req, res, next) {
    debug('inside addUser controller')
    var params = req.body;
    var newUser = new userModel();
    newUser.name = params.name;
    newUser.surName = params.surName;

    debug('new user %o',newUser);

    newUser.save(function (error, document) {
        if (error) {
            return next(error);
        }
        req.session.data = document;
       return next();
    });
};



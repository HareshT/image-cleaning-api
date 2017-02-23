'use strict';

var debug = require('debug')('imageCleaning: testController');
var UserModel = require('../models/TestUserModel');
var Boom = require('boom');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');

exports.addUser = function (req, res, next) {
    debug('inside addUser controller');
    var params = req.body;
    var newUser = new UserModel();
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



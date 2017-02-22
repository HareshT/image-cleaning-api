'use strict';

var debug = require('debug')('imageCleaning: imagesService');
var Boom = require('boom');
var _ = require('lodash');

var imagesModel = require('../models/imagesModel');

exports.validateUploadedImage = function (req, res, next) {
    debug('inside validateUploadedImage')
    var params = req.body;
    debug('params %o', req.body)
    var fileName = req.file.originalname;
    debug('params %o', req.file)
    if (_.isEmpty(fileName)) {
        return next(new Boom.notFound('Invalid file'));
    }
    return next();
};
exports.validateGetAllImagesParams = function(req,res,next){
    debug('inside validateGetAllImages')
    var params = _.merge(req.query, req.body);
    debug('params %o',params)
    if (_.isEmpty(params)) {
        return next(new Boom.notFound('Invalid file'));
    }
    req.session.params = params;
    return next();
};


exports.validateParams = function(req, res ,next){
    debug('inside validateParams')
    var params = _.merge(req.query, req.body);
    debug('params %o : ',params)
    if(_.isEmpty(params)){
        return next(new Boom.notFound('invalid Data'))
    }
    req.session.params = params;
    return next();
};


exports.validateVerifyOneImageParams = function(req, res ,next){
    debug('inside validateVerifyOneImageParams')
    var params = _.merge(req.query, req.body);
    debug('params %o : ',params)
    if(_.isEmpty(params)){
        return next(new Boom.notFound('invalid Data'))
    }
    req.session.params = params;
    return next();
};

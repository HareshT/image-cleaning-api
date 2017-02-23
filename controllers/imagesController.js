'use strict';

var debug = require('debug')('imageCleaning: imagesController');
var Boom = require('boom');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');

var mongoose = require('mongoose');
var fs = require('fs');

var imagesModel = require('../models/ImagesModel');

exports.sendAllImagesDetail = function (req, res, next) {
  if (_.isEmpty(req.session.allImagesDetail)) {
    return next(new Boom.notFound('invalid Data'));
  }
  var responseData = req.session.allImagesDetail;
  req.session.data = responseData;
  return next();
};

exports.sendDataAfterPointUpdated = function(req,res,next){
  if (_.isEmpty(req.session.updatedImg)) {
    return next(new Boom.notFound('invalid Data'));
  }
  var responseData = req.session.updatedImg;
  req.session.data = responseData;
  return next();
};


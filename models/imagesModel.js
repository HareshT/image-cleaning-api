'use strict';

var debug = require('debug')('imageCleaning: ImagesModel');
var Mongoose = require('mongoose');
var _ = require('lodash');
var Boom = require('boom');
var mongoose = require('mongoose');


var ImagesModelSchema = new Mongoose.Schema({
  imgName: {
    type: String,
    required: true
  },
  imgPath: {
    type: String,
    required: true
  },
  imgPoint: {
    type: Number
  },
  imgArcPath: {
    type: String,
    required: false
  },
  isDeleted: {
    type: Boolean
  }
});

//ImagesModelSchema.index(
//    {
//        _id: 1,
//        enabled: 1
//    }
//);

var ImagesModel = Mongoose.model('images', ImagesModelSchema);

exports.insert = function (data, callback) {
  debug('inside insert');
  //debug('data %o', data);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('invalid Data'));
  }
  var newImage = new ImagesModel();
  newImage.imgName = data.imgName;
  newImage.imgPath = data.imgPath;
  newImage.imgPoint = 0;
  newImage.isDeleted = false;
  newImage.save(function (error, savedImg) {
    if (!_.isEmpty(error)) {
      //debug('errror in saveImg %o',error);
      return callback(error);
    }
    //debug('savedImg %o',savedImg);
    return callback(null, savedImg);
  });
};

exports.updateAllByFilter = function (data, callback) {
  debug('inside update');
  //debug('data %o', data);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('invalid Data'));
  }
  ImagesModel.update(data.query,data.setValue, {multi: true},function (error, result) {
    if (!_.isEmpty(error)) {
      return callback(error);
    }
    return callback(null, result);
  });
};

exports.findOneAndUpdatebByFilter = function (data, callback) {
  debug('inside findOneAndUpdatebByFilter');
  //debug('data %o', data);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('invalid Data'));
  }
  ImagesModel.findOneAndUpdate(data.query,data.setValue,function (error, result) {
    if (!_.isEmpty(error)) {
      return callback(error);
    }
    return callback(null, result);
  });
};

exports.findAll = function (callback) {
  debug('inside findAll');
  //debug('data %o',data);
  ImagesModel.find({}, function (error, result) {
    if (!_.isEmpty(error)) {
      //debug('errror in findAll %o',error);
      return callback(error);
    }
    //debug('savedImg %o',savedImg);
    return callback(null, result);
  });
};

exports.findAllByFilter = function (data, callback) {
  debug('inside findAllByFilter');
  //debug('data %o', data);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('invalid Data'));
  }
  ImagesModel.find(data, function (error, result) {
    if (!_.isEmpty(error)) {
      return callback(error);
    }
    return callback(null, result);
  });
};

exports.findAllByDatatableFilter = function (data, callback) {
  debug('inside findAllByFilter');
  //debug('data %o', data);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('invalid Data'));
  }
  ImagesModel.find(data.query, function (error, result) {
    if (!_.isEmpty(error)) {
      return callback(error);
    }
    return callback(null, result);
  }).sort(data.queryOrderBy).skip(data.queryFilter.offset).limit(data.queryFilter.limit);
};

exports.countRecords = function (data, callback) {
  debug('inside countRecord');
  //debug('data %o', data);
  ImagesModel.count(data, function (error, result) {
    if (!_.isEmpty(error)) {
      return callback(error);
    }
    return callback(null, result);
  });
};
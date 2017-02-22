'use strict';

var debug = require('debug')('imageCleaning: imagesController');
var Boom = require('boom');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

var imagesModel = require('../models/imagesModel');
var constantConfig = require('../config-local');

exports.saveImageToDatabase = function (req, res, next) {
  debug('Inside saveImage');

  var params = req.body;
  var fileParams = req.file;
  var newImage = new imagesModel();
  newImage.imgName = fileParams.originalname;
  newImage.imgPath = 'images\\AllImages\\';
  newImage.imgPoint = 0;
  //debug('iamge Detail %o',newImage);

  newImage.save(function (error, saveImg) {
    if (error) {
      return next(error);
    }
    req.session.data = saveImg;
    debug('image Detail %o', req.session);
    return next();
  });
};

exports.getAllimages = function (req, res, next) {
  debug('Inside getAllimages', req.session.params)
  if (_.isEmpty(req.session.params)) {
    return next(new Boom.notFound('invalid Data'));
  }
  var params = req.session.params;
  var queryFilter = {
    limit: 10,
    offset: 0
  };
  //var queryOrderBy = {
  //  imgName: 1
  //};
  var query = {'isDeleted': false}
  var responseData = {}
  async.series({
    setQueryFilter: function (callback) {
      //OrderBy query
      //if (!_.isEmpty(params.order)) {
      //  queryOrderBy = {};
      //  debug('params colums ', params.order.column)
      //  switch (params.order.column) {
      //    case 0:
      //      queryOrderBy.imgName = params.order.dir == 'asc' ? 1 : -1;
      //      break;
      //    case 2:
      //      queryOrderBy.imgPoint = params.order.dir == 'asc' ? 1 : -1;
      //      break;
      //  }
      //}
      //Limit And Skip query
      if (!isNaN(params.limit) && params.limit != '') {
        queryFilter.limit = params.limit;
      }
      if (!isNaN(params.offset) && params.offset != '') {
        queryFilter.offset = params.offset;
      }

      //filter by image point
      if (!_.isEmpty(params.filter)) {
        query['$and'] = [{imgPoint: {$gte: params.filter.minPoint}}, {imgPoint: {$lte: params.filter.maxPoint}}]
      }
      return callback();
    },
    getTotalRecordCount: function (callback) {
      imagesModel.count({'isDeleted': false}, function (error, count) {
        responseData.recordsTotal = count;
        return callback();
      });
    },
    getTotalFilteredRecordCount: function (callback) {
      imagesModel.count(query, function (error, count) {
        responseData.recordsFiltered = count;
        return callback();
      });
    },
    getAllImage: function (callback) {
      imagesModel.find(query, function (error, resImgs) {
        if (!_.isEmpty(error)) {
          return next(error);
        }
        responseData.data = resImgs;
        return callback();
      }).skip(queryFilter.offset).limit(queryFilter.limit);
    }
  }, function (error) {
    if (!_.isEmpty(error)) {
      return next(error)
    }
    req.session.data = responseData;
    return next()
  })
};

exports.moveImageToAnotherDirectory = function (req, res, next) {
  var params = req.session.params;
  if (_.isEmpty(params.archivedImgDetail) || _.isEmpty(params.destinationPath)) {
    return next(new Boom.notFound('invalid Data'));
  }
  var CurrentPathArray = _.split(__dirname, '\\');
  var pathArray = _.take(CurrentPathArray, CurrentPathArray.length - 1);
  var path = '..\\public'

  var sourcePath = '.\\public' + params.archivedImgDetail.imgPath + '' + params.archivedImgDetail.imgName;
  var destinationPath = '.\\public\\images\\' + params.destinationPath + '\\' + params.archivedImgDetail.imgName;
  var source = fs.createReadStream(sourcePath);
  var destination = fs.createWriteStream(destinationPath);

  source.pipe(destination);
  source.on('end', function () {
    source.close();
    fs.unlink(sourcePath);
    return next();
  });
}

exports.increaseOnePointsForAllAboveImages = function (req, res, next) {
  var params = req.session.params;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('invalid Data'));
  }
  // debug('array :', params.incresePointImgsArray)
  async.series({
    increaseOnePointsForAllAboveImages: function (callback) {
      if (_.isEmpty(params.incresePointImgsArray)) {
        return callback();
      }
      var query = {
        '_id': {
          $in: _.map(params.incresePointImgsArray, function (id) {
            return mongoose.Types.ObjectId(id)
          })
        },
        'isDeleted': false
      };
      var setValue = {$inc: {imgPoint: 1}}
      imagesModel.update(query, setValue, {multi: true}, function (error, updImgPoints) {
        if (!_.isEmpty(error)) {
          return callback(error)
        }
        return callback()
      });
    },
    movedImageToarchived: function (callback) {
      if (_.isEmpty(params.archivedImgDetail)) {
        return next(new Boom.notFound('invalid Data'));
      }
      var query = {
        '_id': mongoose.Types.ObjectId(params.archivedImgDetail._id),
        'isDeleted': false
      };
      var setValue = {$set: {'isDeleted': true, imgPath: 'images\\' + params.destinationPath + '\\'}}
      imagesModel.findOneAndUpdate(query, setValue, function (error, updImgStatus) {
        if (!_.isEmpty(error)) {
          return callback(error)
        }
        req.session.data = updImgStatus;
        return callback()
      });
    }
  }, function (error) {
    if (!_.isEmpty(error)) {
      return next(error)
    }
    return next()
  })
};

exports.verifyOneImageAndAddOnePoint = function (req, res, next) {
  var params = req.session.params;
  if (_.isEmpty(params)) {
    return next(new Boom.notFound('invalid Data'));
  }
  async.series({
    verifyOneImageAndAddOnePoint: function (callback) {
      var query = {
        '_id': mongoose.Types.ObjectId(params.verifyImageId),
        'isDeleted': false
      };
      var setValue = {$inc: {imgPoint: 1}}
      imagesModel.findOneAndUpdate(query, setValue, function (error, updImgStatus) {
        if (!_.isEmpty(error)) {
          return callback(error)
        }
        req.session.data = updImgStatus;
        return callback()
      });
    }
  }, function (error) {
    if (!_.isEmpty(error)) {
      return next(error)
    }
    return next();
  })
};

exports.getApiUrl = function (req, res, next) {
  //debug('Inside getApiUrl');
  res.send(constantConfig.apiUrl);
}
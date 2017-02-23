'use strict';

var debug = require('debug')('imageCleaning: imagesService');
var Boom = require('boom');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var fs = require('fs');

var ImagesModel = require('../models/ImagesModel');


exports.validateGetAllImagesParams = function(req,res,next){
    debug('inside validateGetAllImages');
    var params = _.merge(req.query, req.body);
    debug('params %o',params);
    if (_.isEmpty(params)) {
        return next(new Boom.notFound('Invalid file'));
    }
    req.session.params = params;
    return next();
};


exports.validateParams = function(req, res ,next){
    debug('inside validateParams');
    var params = _.merge(req.query, req.body);
    debug('params %o : ',params);
    if(_.isEmpty(params)){
        return next(new Boom.notFound('invalid Data'));
    }
    req.session.params = params;
    return next();
};


exports.validateVerifyOneImageParams = function(req, res ,next){
    debug('inside validateVerifyOneImageParams');
    var params = _.merge(req.query, req.body);
    debug('params %o : ',params);
    if(_.isEmpty(params)){
        return next(new Boom.notFound('invalid Data'));
    }
    req.session.params = params;
    return next();
};

exports.getAllimages = function (req, res, next) {
    debug('Inside getAllimages', req.session.params);
    if (_.isEmpty(req.session.params)) {
        return next(new Boom.notFound('invalid Data'));
    }
    var params = req.session.params;
    var queryFilter = {
        limit: 10,
        offset: 0
    };
    var queryOrderBy = {};
    var query = {'isDeleted': false};
    var responseData = {};
    async.series({
        setQueryFilter: function (callback) {
            //OrderBy query
            if (!_.isEmpty(params.order)) {
              queryOrderBy = {};
              debug('params colums ', params.order.column);
              switch (params.order.column) {
                case 0:
                  queryOrderBy.imgName = params.order.dir === 'asc' ? 1 : -1;
                  break;
                case 2:
                  queryOrderBy.imgPoint = params.order.dir === 'asc' ? 1 : -1;
                  break;
              }
            }
            //Limit And Skip query
            if (!isNaN(params.limit) && params.limit !== '') {
                queryFilter.limit = params.limit;
            }
            if (!isNaN(params.offset) && params.offset !== '') {
                queryFilter.offset = params.offset;
            }

            //filter by image point
            if (!_.isEmpty(params.filter)) {
                query['$and'] = [{imgPoint: {$gte: params.filter.minPoint}}, {imgPoint: {$lte: params.filter.maxPoint}}];
            }
            return callback();
        },
        getTotalRecordCount: function (callback) {
            ImagesModel.countRecords({'isDeleted': false}, function (error, count) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                responseData.recordsTotal = count;
                return callback();
            });
        },
        getTotalFilteredRecordCount: function (callback) {
            ImagesModel.countRecords(query, function (error, count) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                responseData.recordsFiltered = count;
                return callback();
            });
        },
        getAllImage: function (callback) {
            var data = {
                query : query,
                queryOrderBy : queryOrderBy,
                queryFilter : queryFilter
            };
            ImagesModel.findAllByDatatableFilter(data, function (error, resImgs) {
                if (!_.isEmpty(error)) {
                    return next(error);
                }
                responseData.data = resImgs;
                return callback();
            });
        }
    }, function (error) {
        if (!_.isEmpty(error)) {
            return next(error);
        }
        req.session.allImagesDetail = responseData;
        return next();
    });
};

exports.moveImageToAnotherDirectory = function (req, res, next) {
    var params = req.session.params;
    if (_.isEmpty(params.archivedImgDetail) || _.isEmpty(params.destinationPath)) {
        return next(new Boom.notFound('invalid Data'));
    }

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
};

exports.increaseOnePointsForAllAboveImages = function (req, res, next) {
    var params = req.session.params;
    var queryData = {};
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
                        return mongoose.Types.ObjectId(id);
                    })
                },
                'isDeleted': false
            };
            var setValue = {$inc: {imgPoint: 1}};
            queryData ={
                query : query,
                setValue : setValue
            };
            ImagesModel.updateAllByFilter(queryData, function (error, updImgPoints) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                return callback();
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
            var setValue = {$set: {'isDeleted': true, imgPath: 'images\\ AllArchivedImages\\'}};
            queryData ={
                query : query,
                setValue : setValue
            };
            ImagesModel.findOneAndUpdatebByFilter(queryData, function (error, updImgStatus) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                req.session.updatedImg = updImgStatus;
                return callback();
            });
        }
    }, function (error) {
        if (!_.isEmpty(error)) {
            return next(error);
        }
        return next();
    });
};

exports.verifyOneImageAndAddOnePoint = function (req, res, next) {
    var params = req.session.params;
    var queryData ={};
    if (_.isEmpty(params)) {
        return next(new Boom.notFound('invalid Data'));
    }
    async.series({
        verifyOneImageAndAddOnePoint: function (callback) {
            var query = {
                '_id': mongoose.Types.ObjectId(params.verifyImageId),
                'isDeleted': false
            };
            var setValue = {$inc: {imgPoint: 1}};

            queryData ={
                query : query,
                setValue : setValue
            };
            ImagesModel.findOneAndUpdatebByFilter(queryData, function (error, updImgStatus) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                req.session.updatedImg = updImgStatus;
                return callback();
            });
        }
    }, function (error) {
        if (!_.isEmpty(error)) {
            return next(error);
        }
        return next();
    });
};

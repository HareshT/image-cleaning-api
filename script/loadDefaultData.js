'use strict';

var debug = require('debug')('imageCleaning: appStartUpScript');
var _ = require('lodash');
var async = require('async');

var imagesModel = require('../models/imagesModel');

exports.addAllImagesToDataBase = function () {
  debug('inside addAllImagesToDataBase')
  var allImagesNamePresentInDb = [];
  var allImagesNameToBeAddedInDb = [];
  async.series({
    findAllimagesPresentInDatabase: function (callaback) {
      imagesModel.find({}, function (error, resImgsDetail) {
        if (!_.isEmpty(error)) {
          return callaback(error);
        }
        if (!_.isEmpty(resImgsDetail)){
          async.forEachLimit(resImgsDetail, 2, function (oneImgDetail, innerCallback) {
            allImagesNamePresentInDb.push(oneImgDetail.imgName);
            return innerCallback();
          }, function (error) {
            return callaback();
          });
        }
        return callaback();
      })
    },
    createNameArrayToBeAdded: function (callback) {
      var limit = 15;
      for (var i = 1; i <= limit; i++) {
        var imgName = i + '.png'
        if (_.indexOf(allImagesNamePresentInDb, imgName) === -1) {
          allImagesNameToBeAddedInDb.push(imgName);
        }
      }
      return callback()
    },
    addNewImagesToDatabse: function (callback) {
      debug('images Name', allImagesNameToBeAddedInDb);
      async.forEachLimit(allImagesNameToBeAddedInDb, 2, function (oneImgDetail, innerCallback) {
        var newImage = new imagesModel();
        newImage.imgName = oneImgDetail;
        newImage.imgPath = '\\images\\AllImages\\';
        newImage.imgPoint = 0;
        debug('iamge Detail %o', newImage);

        newImage.save(function (error, saveImg) {
          if (error) {
            return innerCallback();
          }
          return innerCallback();
          debug('image Detail %o', saveImg);
        });
      }, function (error) {
        return callback();
      });
    }
  }, function (error) {
    if (_.isEmpty(error)) {

    }
  })
};

this.addAllImagesToDataBase();
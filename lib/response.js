'use strict';
/**
 * This file modifies the request-response of the app.
 * What should do before request execute and what should do after request execution complete.
 */
var debug = require('debug')('imageCleaning:RequestResponse');
var Boom = require('boom');
var _ = require('lodash');
var Utils = require('./Utils/Utils');

exports.trimParams = function (req, res, next) {
  debug('API : %o', Utils.url(req) + req.url);
  debug('req.method : %o ', req.method);

  // Trinm query and post parameters
  if (req.query) {
    for (var i in req.query) {
      if (_.isString(req.query[i])) {
        req.query[i] = req.query[i].trim();
      }
    }
  }

  if (req.body) {
    for (i in req.body) {
      if (_.isString(req.body[i])) {
        req.body[i] = req.body[i].trim();
      }
    }
  }
  debug('req.body : %o ', req.body);
  debug('req.query : %o ', req.query);
  next();
};

exports.handleSuccess = function (req, res, next) {
  var response = req.session.data || [];
  req.session.destroy();
  debug('Success response : %o ', response);
  return res.send(response);
};

exports.handleError = function (err, req, res, next) {
  if (!err) {
    return next();
  }
  var errorResponse = {
    error: _.merge({
      stack: err.stack
    }, err.output && err.output.payload ? err.output.payload : err)
  };
  //debug('Error stack :: ');
//  debug(err.stack);
  debug('error response : %o ', errorResponse);
  return res.status(err.output && err.output.statusCode ? err.output.statusCode : 500).json(errorResponse);
};
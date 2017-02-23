/**
 * Created by Patoliya on 05-Apr-16.
 */
'use strict';
/**
 * This file contains utility used by the app.
 *
 */
var debug = require('debug')('NODE:utils');
var bcrypt = require('bcrypt');
var _ = require('lodash');

exports.url = function (req) {
  return req.protocol + '://' + req.get('host');
};


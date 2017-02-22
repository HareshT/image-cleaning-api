'use strict';
/**
 * This file base of for the other App files, all files are included here and returned as object to www.js.
 *
 */
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var routeV1 = require('./routes/v1/index');
var response = require('./lib/response');
var config = require('./config-local');
var path = require('path')
var app = express();

var startUpScript = require('./script/loadDefaultData');

// Connect to our database
// Ideally you will obtain DB details from a environment variable
var dbName = config.dbName;
var connectionString = config.dbUrl + dbName;

// CORS
app.use(function (request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Handle request
app.use(session({
  secret: 'avevgretaswdef23wef23',
  saveUninitialized: false, // don't create session until something stored,
  resave: false // don't save session if unmodified
}));

mongoose.connect(connectionString);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(response.trimParams);
app.use(express.static(path.join(__dirname, 'public')));

// This is our route middleware
app.use('/api/v1', routeV1);

// Error handling
app.use(response.handleError);

// Handle response
app.use(response.handleSuccess);

module.exports = app;
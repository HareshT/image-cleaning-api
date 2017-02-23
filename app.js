'use strict';
/**
 * This file base of for the other App files, all files are included here and returned as object to server.js.
 *
 */
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var ejs = require('ejs');

var routeV1 = require('./routes/v1/index');
var response = require('./lib/response');
var app = express();

var startUpScript = require('./scripts/loadDefaultData');

// Connect to our database
// Ideally you will obtain DB details from a environment variable
var dbName = process.env.IMAGE_DB_NAME;
var connectionString = process.env.IMAGE_DB_URL + dbName;

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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(response.trimParams);
app.use(express.static(path.join(__dirname, 'public')));

//this is api Route Path
app.get('/',function(req,res){
    res.render('pages/index.ejs');
});

// This is our route middleware
app.use('/api/v1', routeV1);

// Error handling
app.use(response.handleError);

// Handle response
app.use(response.handleSuccess);

module.exports = app;
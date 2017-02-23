'use strict';

var express = require('express');

var testRoutes = require('./TestRoutes');
var imagesRoutes = require('./ImagesRoutes');
var router = express.Router();

//test Route
router.use('/testRoute', testRoutes);

//Images Routes
router.use('/images', imagesRoutes);

module.exports = router;


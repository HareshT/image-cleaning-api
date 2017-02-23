var express = require('express');

var testRoutes = require('./testRoutes');
var imagesRoutes = require('./imagesRoutes');
var router = express.Router();

//test Route
router.use('/testRoute', testRoutes);

//Images Routes
router.use('/images', imagesRoutes);

module.exports = router;


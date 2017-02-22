'use strict';

var express               = require('express');
var router                = express.Router();
var testService       = require('../../services/testService');
var testController    = require('../../controllers/testController');

router.post('/addUser',[
    testService.validateUser,
    testController.addUser
]);

//router.get('/:name',
//    [
//        testService.validateRequest,
//        testController.getUserInfo
//    ]);

module.exports = router;
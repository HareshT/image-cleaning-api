'use strict';

var express               = require('express');
var router                = express.Router();
var TestService       = require('../../services/TestService');
var TestController    = require('../../controllers/TestController');

router.post('/addUser',[
    TestService.validateUser,
    TestController.addUser
]);

//router.get('/:name',
//    [
//        testService.validateRequest,
//        testController.getUserInfo
//    ]);

module.exports = router;
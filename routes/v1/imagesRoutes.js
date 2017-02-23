'use strict';

var express = require('express');
var router = express.Router();

var ImagesService = require('../../services/ImagesService');
var ImagesController = require('../../controllers/ImagesController');


router.post('/getAllImages',[
    ImagesService.validateGetAllImagesParams,
    ImagesService.getAllimages,
    ImagesController.sendAllImagesDetail
]);

router.post('/increaseOnePointsForAllAboveImages',[
    ImagesService.validateParams,
    ImagesService.moveImageToAnotherDirectory,
    ImagesService.increaseOnePointsForAllAboveImages,
    ImagesController.sendDataAfterPointUpdated
]);
router.post('/verifyOneImage',[
    ImagesService.validateVerifyOneImageParams,
    ImagesService.verifyOneImageAndAddOnePoint,
    ImagesController.sendDataAfterPointUpdated
]);

module.exports = router;
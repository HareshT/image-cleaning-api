'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
//var upload = multer({dest: './public/images/allImages'});  //* this is for static file name *//
var st = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'F:\\Projects\\imageCleaning\\imageCleaningFrontEnd\\app\\images\\AllImages')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var storage = multer({storage: st})

var imagesService = require('../../services/ImagesService');
var imagesComtroller = require('../../controllers/imagesController');


router.post('/getAllImages',[
    imagesService.validateGetAllImagesParams,
    imagesComtroller.getAllimages
]);

router.post('/uploadImg', storage.single('img'),[
    imagesService.validateUploadedImage,
    imagesComtroller.saveImageToDatabase
]);

router.post('/increaseOnePointsForAllAboveImages',[
    imagesService.validateParams,
    imagesComtroller.moveImageToAnotherDirectory,
    imagesComtroller.increaseOnePointsForAllAboveImages
]);
router.post('/verifyOneImage',[
    imagesService.validateVerifyOneImageParams,
    imagesComtroller.verifyOneImageAndAddOnePoint
]);

router.post('/getApiUrl',[
    imagesComtroller.getApiUrl
]);

module.exports = router;
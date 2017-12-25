var express = require('express');
var router = express.Router();
var model=require('./model');
/* GET home page. */
router.get('/', function(req, res, next) {
 
 res.json({message:'zain ali'});

});

module.exports = router;

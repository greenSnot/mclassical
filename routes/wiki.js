var express = require('express');
var router = express.Router();

var config=require('../config');
var utils=require('../utils');

router.get('/',function(req,res){
    res.render('wiki',{});
});

module.exports = router;

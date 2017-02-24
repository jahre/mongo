var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  /*var db = req.db;
  var collection = db.get('documents');
    collection.find({},{},function(e,docs){
        res.render('details', { data: docs });
    });*/

    res.send('addDetails');
});



module.exports = router;
var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect('/');
});


// router.get('/:service/:service_detail', function(req, res, next) {
      
//      var db = req.db;
//       var collection = db.get('documents');
//       collection.find({ },{},function(e,docs){
//         //name: req.params.service, content: req.params.service_detail
//         if (!docs){
//           res.render('error', { message: '404' });
//         }else{
//           console.log(docs);
//           res.render('details', { data: docs });
//         };

       
        
//       });

      

// });

module.exports = router;
var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('tree');

    var specialContour = 0;
    function counter(){
        specialContour = specialContour + 1;
        return specialContour;
    }
    
    var lastofus = new Promise(function(resolve, reject){
        var familyArray = [];
        getChildren = function(id) {
            return new Promise(function(resolve, reject){
                var result = collection.find({parent: id});
                if(id == 'MongoDB' || id == 'dbm' || id == 'Languages'){
                    reject();
                }else{
                    
                    resolve(result)
                }

            
                
            }).then(function(successMessage){
                successMessage.forEach(function(child) {
                    console.log(child);
                    
                    getChildren(child._id); 
                    familyArray.push(child);
                    return child; 
            
                });
                
                
                
            })
            .catch(function () {
                console.log("Promise Rejected");
            });           
            
        };
        resolve(getChildren('Books'));
    });

    lastofus.then(function(resq){
        res.send(resq);
    }).catch(function () {
                console.log("111Promise Rejected");
            });
    


    
});



module.exports = router;

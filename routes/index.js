var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('tree');
    var i = 0;
    var familyArray = [];
    getChildren = function(id) {
        return new Promise(function(resolve, reject){
            var result = collection.find({parent: id});
            if(id == 'MongoDB' || id == 'dbm' || id == 'Languages' || i==4){
                if(i==4) { 
                    console.log(familyArray);
                    res.render('index', { data: familyArray });
                }
                reject();
            }else{
                
                resolve(result)
            }            
        }).then(function(successMessage){
            successMessage.forEach(function(child) {
                console.log(child);
                getChildren(child._id); 
                familyArray.push(child);
                console.log(i);
                //return child; 
                i++;
            });            
        })
        .catch(function () {
            console.log("Promise Rejected");
        });           
        
    };    

    getChildren('Books');
    //res.render('index', { data: familyArray });
});



module.exports = router;

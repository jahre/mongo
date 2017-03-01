var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('tree');
    var i = 0;
    var documentCount = 0;
    var familyArray = [];
    var familyObject = {};
    //var gg = {children: []};
    var gg;
    //var masteryourdemons = {children: ['33']};
    var masteryourdemons = {};
    getChildren = function(id, count1, sett = true) {

        //=======================================================init
         if(count1 == undefined){
              return new Promise(function(resolve, reject){
                //initialInfo = collection.find({children:[]}).count();
                initialInfo = collection.count();
                //initialInfo = 6;
                if(initialInfo){
                    resolve(initialInfo);
                }else{
                    reject();
                };
                
              }).then(function(info){
                getChildren(id, info); 
           
        })
        .catch(function () {
            console.log("Promise Rejected");
        });
                
         };
        
        //=========================================================action
        return new Promise(function(resolve, reject){
                //console.log('=========' + sett);
                
                if(documentCount == 0){
                    documentCount = count1;
                    
                }
                //console.log(i);
                //return child; 
                i++;
                //var result = collection.find({parent: id}).sort({position: -1});
                var result = collection.find({parent: id}, { sort : { position : 1 } });
                var childrenCheck = result
                if(!sett || i == documentCount){
                    if(i == documentCount) { 
                        //console.log(familyArray);
                        console.log('masteryourdemons:');
                        console.log(masteryourdemons);
                        //console.log(familyObject);
                        //console.log('+++++++++');
                        //console.log(masteryourdemons);
                        //console.log('+++++++++');
                        //res.render('index', { data: familyArray });
                        //res.render('index', { data: masteryourdemons });
                        res.send(masteryourdemons);
                    }
                    reject();
                }else{
                    resolve(result)
                }     
                  
        }).then(function(successMessage){
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log(successMessage);
            var positionC = 0;
            successMessage.forEach(function(child) {
                // for(var v = 0; v < successMessage.length; v++){
                //     var child = successMessage[v];
                // masteryourdemons.children[child.position] = child;
                // masteryourdemons = masteryourdemons.children[child.position];

                function drakon(param, pos){
                    //param.children[pos] = {};
                    return param.children[pos];
                };

                var b;
                var takeNumber = 0;
                function drakonv2(obj, name) {
                    console.log('=take: ' + takeNumber);
                    takeNumber++;
                    for (var c = 0; c < obj.children.length; c++) {
                        if (obj.children[c] == name) {
                        console.log('yes: ' + obj.children[c]);
                        console.log(obj);
                        b = obj;
                        return
                        } else if (c == (obj.children.length - 1)) {
                        console.log('end of list: ');
                        console.log(obj.children);
                        var endendOfList = 0;
                        obj.children.forEach(function(objchild) {
                            if(typeof objchild == 'object'){
                            return drakonv2(objchild, name);
                        }
                        return          
                        });
                            };
                    };
                };

                if(i == 1){
                    console.log('init');
                    masteryourdemons = child;
                }else{
                    console.log('action on: ' + child._id);
                    console.log(masteryourdemons);
                    drakonv2(masteryourdemons, child._id);
                    b.children[positionC] = {};
                    b.children[positionC] = child;
                }
                

                

                familyArray.push(child);
                // familyArray.push('22');
                // function midresult(fam){
                //     if(i == 1){
                //         familyObject = fam;
                //     }
                //     return fam.children
                // };
                // midresult(child).push(getChildren(child._id, child.children.length))
                //familyObject.children.push(child);
                 
                //if(child.children.length){
                    
                    getChildren(child._id, child.children.length); 
                    positionC++
                //}

                
                
                
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

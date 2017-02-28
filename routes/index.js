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
    var masteryourdemons = {children: ['33']};
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
                var result = collection.find({parent: id});
                //.sort( { position: -1 } );
                var childrenCheck = result
                if(!sett || i == documentCount){
                    if(i == documentCount) { 
                        console.log(familyArray);
                        //console.log(familyObject);
                        //console.log('+++++++++');
                        //console.log(masteryourdemons);
                        //console.log('+++++++++');
                        res.render('index', { data: familyArray });
                    }
                    reject();
                }else{
                    
                    resolve(result)
                }     
                  
        }).then(function(successMessage){
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log(successMessage);
            //successMessage.forEach(function(child) {
                for(var v = 0; v < successMessage.length; v++){
                    var child = successMessage[v];
                // masteryourdemons.children[child.position] = child;
                // masteryourdemons = masteryourdemons.children[child.position];

                function drakon(param, pos){
                    param.children[pos] = {};
                    return param.children[pos];
                };
                if(i == 1){
                    console.log(i + '===1===');
                    //console.log(masteryourdemons.children[0]);
                    //console.log(child);
                    masteryourdemons.children[0] = child;
                    console.log(masteryourdemons.children[0]);
                    //gg = drakon(masteryourdemons.children[0], 0);        
                    gg = masteryourdemons.children[0];
                    console.log(gg);
                }else{
                    console.log(i + '===2===');
                    console.log(gg);
                    console.log(i + '===3===');
                    //gg.children[child.position - 1] = child;
                    console.log(gg.children[0]);
                    gg.children[0] = {};
                    gg.children[0] = child;
                    console.log(gg.children[0]);
                    console.log(i + '===4===');
                    //console.log(gg.children[child.position - 1]);
                    console.log(gg.children[0]);
                    gg = drakon(gg, 0);
                    console.log(i + '===5===');
                    console.log(gg);
                };
                

                


                //console.log(child);

                // function makeJson(depth){
                //     if(i == 0){
                //         familyObject = depth;
                //     }
                //     depth.id = _id;
                //     depth.parent = _parent;
                //     depth.children = [];
                //     for(let k = 0; k < depth.children.length; k++){
                //         depth.children[k] = getChildren(depth.children[k], depth.children.length);
                //     };

                //     return depth;
                // }

                // makeJson(child);

                // for(let k = 0; k < deti.length; k++){
                //     depth.children[k] = getChildren(child._id, child.children.length); 
                // };

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
                //}
                
                
            };            
        })
        .catch(function () {
            console.log("Promise Rejected");
        });           
        
    };    

    getChildren('Books');
    //res.render('index', { data: familyArray });
});



module.exports = router;

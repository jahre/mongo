var express = require('express');
var path = require('path');
var router = express.Router();
// var mongo = require('mongodb');
// var monk = require('monk');

// var db = monk('localhost:27017/family');
// 	db.on('error', console.error.bind(console, 'connection error:'));
// 	db.once('open', function() {
// 	console.log('ok-good');
// });
/*var model = [{
	'_id': 'Programming',
	'parent': 'Books',
	'position': '0',
	'children': [
		{
			'_id': 'Languages',
			'parent': 'Programming',
			'position': '0',
			'children': []
		}, {
			'_id': 'Databases',
			'parent': 'Programming',
			'position': '1',
			'children': [
				{
					'_id': 'MongoDB',
					'parent': 'Databases',
					'position': '0',
					'children': []
				}, {
					'_id': 'dbm',
					'parent': 'Databases',
					'position': '1',
					'children': [
						{
							'_id': 'Test',
							'parent': 'dbm',
							'position': '0',
							'children': []
						}
					]
				}
			]
		}, {
			'_id': 'White',
			'parent': 'Programming',
			'position': '2',
			'children': []
		}
	]
}]*/
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('tree');//get family tree collection
    var i = 0;
    var documentCount = 0;
    var familyTree = {};

    getChildren = function (id, collectionLength, settings = true) {
	console.log("** /n /n /n **");	
	//initial request - request to know number of documents
	if (collectionLength == undefined) {
		return new Promise(function (resolve, reject) {
			initialInfo = collection.count();
			if (initialInfo) {
				resolve(initialInfo);
			} else {
				reject();
			};
		})
			.then(function (info) {
                //if all good, call funtcion with documents number, and the same id
				getChildren(id, info);
			})
			.catch(function () {
				console.log("Promise Rejected");
			});
	};

	//requests to retrieve documents data
	return new Promise(function (resolve, reject) {
		if (documentCount == 0) {
			documentCount = collectionLength;
		}
		

        //sort the documents
		//var result = collection.find({parent: id}, {sort: {position: 1}	});
		var result = collection.aggregate(
			[ 
				{ $match: { parent: id } },  
				{ $sort : { position : 1 } }
			]
		);
		var childrenCheck = result;
		console.log(":::::::::::::::::::::::: documentCount  " + documentCount);
		console.log(":::::::::::::::::::::::: i  " + i);
		console.log(":::::::::::::::::::::::: collectionLength  " + !collectionLength);
		if (!collectionLength || i == documentCount) {
			if (i == documentCount) {
				console.log('Finally!familyTree:');
				console.log(familyTree);
				res.send(familyTree);
			}
			i++;
			reject();
		} else {
			i++;
			resolve(result)
		}
	})
		.then(function (queryDataArray) {
			var childNumber = 0;
			queryDataArray.forEach(function (child) {
				var familyTreeBuffer;

                
				var iterationNumber = 0;//only for display iteration number in console

				function retrieveAncestors(obj, name) {
                    //try to find current Instance name in the list of children of familyTree
					console.log('==Iteration: ' + iterationNumber);
					iterationNumber++;

					for (var c = 0; c < obj.children.length; c++) {
						if (obj.children[c] == name) {
                            //when name is found, buffer is set to needed depth 

							console.log('Name has been found: ' + obj.children[c]);
							console.log(obj);
							familyTreeBuffer = obj;
							return
						} else if (c == (obj.children.length - 1)) {
                            //if there is no children, let's go deper in each nested object, maybe they are there

							console.log('End of list: ');//end of Names list in current object
							console.log(obj.children);
							var endendOfList = 0;

							obj.children.forEach(function (objchild) {
									if (typeof objchild == 'object') {//if object, let's search in it
										return retrieveAncestors(objchild, name);
									}
									return
								});
						};
					};
				};


                
				if (i == 1) {//omit if request is initial
					familyTree = child;
				} else {
					console.log('Finding Ancestors in: ' + child._id);
					retrieveAncestors(familyTree, child._id);
					familyTreeBuffer.children[childNumber] = {};//string to object change to set a new value
					familyTreeBuffer.children[childNumber] = child;//set an object instead of childs name
				}
				//console.log(":::::::::::::::::::::::: " + child._id);
				//console.log(":::::::::::::::::::::::: " + child.children.length);
				getChildren(child._id, child.children.length);//next call to retrive other children
				childNumber++
			});
		})
		.catch(function () {
			console.log("Promise Rejected (settings) " + settings);
		});
};

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add' });
});

router.post('/add', function(req, res, next) {
  let db = req.db;
  let collection = db.get('tree');//get family tree collection
  let reqParams = req.body;
  console.log('5555555555555555555555555555555555555555555555555555555555555');
  console.log(reqParams);

  collection.insert(
	{ name: reqParams._id, 
      parent: reqParams.parent,
      position: 0,
	  children: [] }
	);

  collection.findAndModify({
    query: { _id: reqParams.parent },
    update: { $push: { children: reqParams._id }}
  });

   res.redirect('/add');
});

getChildren('Books');

});



module.exports = router;

var express = require('express');
var path = require('path');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId; 
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
    //var collection = db.get('tree');//get family tree collection
	//var collection = db.get('cztery');//get family tree collection
	var collection = db.get('five');//get family tree collection
    var i = 1;
    var documentCount = 0;
    var familyTree = {};
	var familyArray = [];

	function countAll(){
		//initial request - request to know number of documents
		return new Promise(function (resolve, reject) {
			let initialInfo = collection.count();
			if (initialInfo) {
				resolve(initialInfo);
			} else {
				reject();
			};
		}).then(function (info) {
				//if all good, call funtcion with documents number, and the same id
				//getChildren('Books', info);
				getStirpes(info);
			})
			.catch(function () {
				console.log("Promise Rejected");
			});
	};

	function getStirpes(count){
		return new Promise(function (resolve, reject) {
			let stirpes = collection.aggregate(
				[ 
					{ $match: { parent: "" } },  
					{ $sort : { position : 1 } }
				]
			);
			if (stirpes) {
				resolve(stirpes);
			} else {
				reject();
			};
		}).then(function (stirpes) {
				//if all good, call funtcion with documents number, and the same id
				
				console.log(count);
				console.log(typeof stirpes[0]._id.toString());
				getChildren(stirpes[0]._id.toString(), count);
				//renderAll(stirpes, count);

			})
			.catch(function () {
				console.log("Promise Rejected");
			});
	}

	function renderAll(currentArray, count){
		//initial request - request to know number of documents
		return new Promise(function (resolve, reject) {
			
			let genesis = getChildren(currentArray[0]._id, count);
			if (genesis) {
				resolve(genesis);
			} else {
				reject();
			};
		}).then(function (info) {
				res.send(info);
			})
			.catch(function () {
				console.log("Promise Rejected");
			});
	};

    function getChildren(id, collectionLength, settings = true) {

	//requests to retrieve documents data
	return new Promise(function (resolve, reject) {
		if (documentCount == 0) {
			documentCount = collectionLength;
		}
		
		//let o_id = new ObjectId(id);
		console.log(":::::::::::::::::::::::: ID  ");
		console.log(id);
		//db.test.find({_id:o_id});
        //sort the documents
		//var result = collection.find({parent: id}, {sort: {position: 1}	});
		
		let result = collection.aggregate(
			[ 
				{ $match: { parent: id } },  
				{ $sort : { position : 1 } }
			]
		);
		var childrenCheck = result;
		console.log(":::::::::::::::::::::::: documentCount  " + documentCount);
		console.log(":::::::::::::::::::::::: i  " + i);
		console.log(":::::::::::::::::::::::: collectionLength  " + collectionLength);
		if (i == documentCount) {
			if (i == documentCount) {
				console.log('Finally!familyTree:');
				console.log(familyTree);
				res.send(familyTree);
				//familyArray.push(familyTree);
				//return familyTree;
			}
			reject();
		} else {
			resolve(result);
			
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
					console.log('---------------------========================::::::::::::::::::: ');
					console.log('---------------------========================::::::::::::::::::: ' + familyTree);
				} else {
					console.log('Finding Ancestors in: ' + child._id + '(' + child.name + ')');
					
					retrieveAncestors(familyTree, child._id.toString());
					familyTreeBuffer.children[childNumber] = {};//string to object change to set a new value
					familyTreeBuffer.children[childNumber] = child;//set an object instead of childs name
				}
				//console.log(":::::::::::::::::::::::: " + child._id);
				//console.log(":::::::::::::::::::::::: " + child.children.length);
				i++;
				getChildren(child._id.toString(), child.children.length);//next call to retrive other children
				childNumber++;
				
			});
		})
		.catch(function () {
			console.log("Promise Rejected (settings) " + settings);
		});
};

router.get('/add', function(req, res, next) {
  let db = req.db;
  //let collection = db.get('cztery');//get family tree collection
  let collection = db.get('five');//get family tree collection

//   collection.find(function (err, docs) {
//     if (err) return console.error(err);
//         let docArray = docs;
// 		onsole.error('err');
//         res.render('add', { data: docArray });
//     })

	function renderDocs(){
		return new Promise(function (resolve, reject) {
			//let collection = db.get('cztery');//get family tree collection
			let collection = db.get('five');//get family tree collection
			let docs = collection.find({});
			if (docs) {
				resolve(docs);
			} else {
				reject(docs);
			};
		}).then(function (info) {
				//res.send(info);
				console.log('0000000000000000000000000000000000000000000000000000000');
				console.log(info);
				res.render('add', { data: info });
			})
			.catch(function () {
				console.log("77777777777777Promise Rejected" + docs);
			});
	};

	renderDocs();
});


router.get('/edit/:id', function(req, res, next) {
  let a_id = req.params.id;

  Article.find({_id: a_id}, function (err, articles) {
    if (err) return console.error(err);
        let artArray = articles[0];
        res.render('article-edit', { data: artArray });
    })
});




router.post('/add', function(req, res, next) {
  let db = req.db;
  //let collection = db.get('cztery');//get family tree collection
  let collection = db.get('five');//get family tree collection
  let reqParams = req.body;

//   console.log('6666666666666666666666666666666666666666666666666666666666666777');
//   console.log('6666666666666666666666666666666666666666666666666666666666666777');
  console.log(reqParams);
  let o_id = new ObjectId();
  //let parent_id = new ObjectId(reqParams.parent);
  collection.insert(
	{ _id: o_id,
	  name: reqParams.name, 
      parent: reqParams.parent,
	  //parent: o_id.toString(),
      position: reqParams.children_count,
	  children: [] }
	);
	
	collection.findAndModify({
		query: { _id: reqParams.parent },
		update: { $push: { children: o_id.toString() }}
	});

	res.redirect('/add');
});

router.post('/delete', function(req, res, next) {
	let db = req.db;
	//let collection = db.get('cztery');//get family tree collection
	let collection = db.get('five');//get family tree collection
	let reqParams = req.body;
	let doc_id = reqParams.doc_id;
	let o_id = new ObjectId(doc_id);
	

  collection.remove({_id: o_id});

  collection.findAndModify({
		query: { children: doc_id },
		update: { $pull: { children: doc_id }}
	});

	res.redirect('/add');
  
});

router.post('/prior', function(req, res, next) {
  let db = req.db;
	//let collection = db.get('cztery');//get family tree collection
	let collection = db.get('five');//get family tree collection
	let reqParams = req.body;
	let doc_id = reqParams.doc_id;
	let prior = reqParams.prior;
	
	let o_id = new ObjectId(doc_id);
	
	collection.findAndModify({
		query: { priority: { $exists: true } },
		update: { $unset: { priority: "" } }
	});

	// collection.findOneAndUpdate({
	// 	query: {_id: o_id },
	// 	update: { $set: { priority: 'doc_priority' } }
	// });

	 collection.findAndModify({
		query: {_id: o_id },
		update: { $set: { priority: !prior }}
	});
	// collection.findAndModify({
	// 	query: {_id: o_id },
	// 	update: { $set: { priority: 1 } }
	// });

	// var doc = collection.findOne({_id: o_id});
	// collection.update({_id: o_id }, {$set: {priority: !doc.priority}});

	//res.redirect('/add');
	//console.log('real6666666666666666666666666666666666666666666666666666666666666777');
	console.log(prior);
	//console.log('reversed6666666666666666666666666666666666666666666666666666666666666777');
	console.log(!prior);

	res.redirect('/add');
	
});


//getChildren('Books');
countAll();

});



module.exports = router;

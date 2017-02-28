db.getCollection('tree').find({})
db.tree.find({children:[]}).count();
db.tree.find({})
db.tree.insert({
    _id: "test2",
    parent: "dbm",
    children: []
    
    })
    
    
db.tree.find({parent: 'Programming'}).sort( { position: -1 } )
db.tree.aggregate(
   [
     { $match: { $parent: "Books" } },
     { $sort : { position : 1 } }
   ]
)
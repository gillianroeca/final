
    var mongo = require('mongodb');
    const MongoClient = mongo.MongoClient;
    const url = "mongodb+srv://cate1344:Cad94010@cluster0.tbm9v.mongodb.net/Recipe_Book?retryWrites=true&w=majority";

    // Set up mongo connection
    MongoClient.connect(url, {useUnifiedTopology : true}, function(err, db) {
        if(err) { return console.log(err); return;}

        var dbo = db.db('Recipe_Book');
        var collection = dbo.collection(coll);
        //var newData = {"name:" names[recipe], "url:" urls[recipe], "image:" images[recipes]};

        collection.insertOne(newData, function(err, res) {
            if (err)
            {
                console.log("querry error: " + err);
                return;
            }
        });
    });

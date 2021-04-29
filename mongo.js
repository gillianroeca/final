const MongoClient = require('mongodb').MongoClient;
var readline = require('readline');
var fs = require('fs');
const url = "mongodb+srv://cate1344:Cad94010@cluster0.tbm9v.mongodb.net/Recipe_Book?retryWrites=true&w=majority";  // connection string goes here

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if(err) { return console.log(err); return;}
  
  
  
  
  var dbo = db.db("Recipe_Book");
  var dnl = dbo.collection('Did_Not_Like');
  var fav = dbo.collection('Favorites');
  var wtt = dbo.collection('Want_To_Try');
  
  file.on('line', function (line) {
      var parts = line.split(',');
      console.log(parts[0] + " " + parts[1]);
      var newData = {"name" : parts[0], "ticker" : parts[1]};
      collection.insertOne(newData, function(err, res) {
          if (err)
          {
              console.log("querry error: " + err);
              return;
          }
          console.log("new document inserted");
      });
      //console.log(line);
  });

	
	console.log("Success!");
	//db.close(); NEED TO CLOSE LATER?!?!!
 
});
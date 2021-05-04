var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;
var readline = require('readline');
const url = "mongodb+srv://cate1344:Cad94010@cluster0.tbm9v.mongodb.net/Recipe_Book?retryWrites=true&w=majority";  // connection string goes here
var port = process.env.PORT || 3000;
//var port = 8080;

http.createServer(function(req, res) {

    //writing the html form onto the webpage

    if (req.url == "/")
    {
        file = "recipe.html";

        fs.readFile(file, function(err, text) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(text);
            res.end();
        });

    }
    else if (req.url == "/display")
    {
      /*  file = "display.html";
        res.on('error', (err) => {
            console.error(err);
        }); */

        pdata = "";
        req.on('data', data => {
            console.log(data.toString());
            pdata += data.toString();

        });

        req.on('end', () => {
            pdata = qs.parse(pdata);
            coll = "";
            name = "";
            if (pdata['submit'] == "Favorites")
            {
                coll = "Favorites"
                name = coll;
            }
            else if (pdata['submit'] == "Didn't Like")
            {
                coll = "Did_Not_Like";
                name = "Did Not Like";
            }
            else if (pdata['submit'] == "Want to Try")
            {
                coll = "Want_To_Try";
                name = "Want To Try";
            }


        output_mongo_collections(name, coll, function(output) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(output);
            res.end();
        });
        });
    }

    else if (req.url == "/add")
    {
        pdata = "";
        req.on('data', data => {
            pdata += data.toString();
        });

        req.on('end', () => {
            var boxNum = pdata[3];
            pdata = qs.parse(pdata);
            var coll = pdata['choose' + boxNum];
            var pname = pdata['name' + boxNum];
            var purl = pdata['url' + boxNum];
            var pimage = pdata['image' + boxNum];

            insert_mongo(coll, pname, purl, pimage);
        });
        file = "recipe.html";

        fs.readFile(file, function(err, text) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(text);
            res.end();
        });

    }

    else if (req.url == "/delete")
    {
       pdata = "";
       req.on('data', data => {
           pdata += data.toString();
       });

       req.on('end', () => {
           var boxNum = pdata[3];
           pdata = qs.parse(pdata);
           var coll = pdata['choose' + boxNum];
           var pname = pdata['name' + boxNum];
           var purl = pdata['url' + boxNum];
           var pimage = pdata['image' + boxNum];

           delete_mongo(coll, pname, purl, pimage,
               function() {
                   output_mongo_collections(coll, coll, function(output) {
                       res.writeHead(200, {'Content-Type': 'text/html'});
                       res.write(output);
                       res.end();
                   });
               }
           );
       });
   }

}).listen(port);
    //}).listen(8080);

function insert_mongo(coll, pname, purl, pimage) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) { return console.log(err); return;}

        //opening the database and collection
        var dbo = db.db("Recipe_Book");
        var collection = dbo.collection(coll);
        // console.log(coll);
        //reading and parsing the file


            //creating the new data
            var newData = {"name" : pname, "url" : purl, "image" : pimage};
            // console.log(newData);
            //inserting the new data
            collection.insertOne(newData, function(err, res) {
                if (err)
                {
                    console.log("querry error: " + err);
                    return;
                }
                console.log(newData);
            });

        //db.close(); --> must close in node.js with ^C
    });
}

function output_mongo_collections(name, coll, callback) {
  var output = "";

  MongoClient.connect(url, {useUnifiedTopology : true}, function(err, db) {
      if(err) { console.log(err); return;}
      var dbo = db.db('Recipe_Book');
      var collection = dbo.collection(coll);

      collection.find({}).toArray(function(err, result) {
          if (err) throw err;

          output += "<h1 style = 'background-color: #f74a4a; text-align: center;";
          output += "padding: 30px; top: 0; left:0; width: 100%; z-index: 2;";
          output += "text-shadow: -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px -1px 0 #FFFFFF;'>";
          output += name + "</h1><br>";
          output += "<form method='post' action='http://localhost:8080/'>";
          output += "<input style = 'text-align:center; background-color:black; left:3vw;";
          output += "background-image: linear-gradient(white, #FF853B); background-size: 30px 100%, 100% 100%; ";
          output += "width:20vw; height:50px; top:20px; line-height:20px; color:black; margin: 5px 8px;";
          output += "border: 3px black solid; border-radius: 10px; font-size: 17px; position:relative; z-index:3;";
          output += "text-decoration: none; float:left; padding: 0px;'";
          output += "type='submit' class='button farleft' name='back' value='Home'>";
          output += "</form>";
          output += "<br><br><br>";

          for (i=0; i<result.length; i++)
          {
              output += "<div class='recipe_block' style='margin: 25px; border: 3px solid #000; float: left; width: 300px; height: 340px; background-color: #c3ebe7;'>"
              output += "<a href='" + result[i]["url"] + "'>" + result[i]["name"] + "</a><br>";
              output += "<img src='" + result[i]["image"] + "'><br>";
              output += "<form method='post' action='http://localhost:8080/delete'>";
              output += "<input type='submit' name='box"+i+"' value='Delete'>"
              output += "<input type='text' id='collection"+i+"' name='choose"+i+"' value='"+coll+"' style='display:none'/>";
              output += "<input type='text' id='name"+i+"' name='name"+i+"' value='"+result[i]["name"]+"' style='display:none'/>";
              output += "<input type='text' id='url"+i+"' name='url"+i+"' value='"+result[i]["url"]+"' style='display:none'/>";
              output += "<input type='text' id='image"+i+"' name='image"+i+"' value='"+result[i]["image"]+"' style='display:none'/>";
              output += "</form>"
              output += "</div>";
          }



          callback(output);
      });


  });
}

function delete_mongo(coll, pname, purl, pimage, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) { return console.log(err); return;}

        //opening the database and collection
        var dbo = db.db("Recipe_Book");
        var collection = dbo.collection(coll);
        // console.log(coll);
        //reading and parsing the file


            //creating the new data
            var newData = {"name" : pname, "url" : purl, "image" : pimage};
            // console.log(newData);
            //inserting the new data
            collection.deleteMany(newData, function(err, res) {
                if (err)
                {
                    console.log("querry error: " + err);
                    return;
                }
                console.log(newData);
                callback();
            });

        //db.close(); --> must close in node.js with ^C
    });
}

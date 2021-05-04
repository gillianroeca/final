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



        show_collection(coll, name, function(output) {
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
          var coll = "";
          if (pdata['choose' + boxNum] == 'Favorites')
          {
              coll = "Favorites";
              console.log(coll);
          }
          else if (pdata['choose' + boxNum] == 'Did Not Like')
          {
              coll = "Did_Not_Like";
              console.log(coll);
          }
          else if (pdata['choose' + boxNum] == 'Want To Try')
          {
              coll = "Want_To_Try";
              console.log(coll);
          }
          else
          {
              console.log("here");
          }


          //var coll = pdata['choose' + boxNum]; ------
          var pname = pdata['name' + boxNum];
          var purl = pdata['url' + boxNum];
          var pimage = pdata['image' + boxNum];

            insert_mongo(coll, pname, purl, pimage);
        });

        file = "recipe.html";

        fs.readFile(file, function(err, text) {
            res.writeHead(200, {'Content-Type': 'text'});
            res.write(text);
            res.url = "/";
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
           var coll = "";
           var name = "";
          if (pdata['choose' + boxNum] == 'Favorites')
          {
              coll = "Favorites";
              name = "Favorites";
              console.log(coll);
          }
          else if (pdata['choose' + boxNum] == 'Did_Not_Like')
          {
              coll = "Did_Not_Like";
              name = "Did Not Like";
              console.log(coll);
          }
          else if (pdata['choose' + boxNum] == 'Want_To_Try')
          {
              coll = "Want_To_Try";
              name = "Want To Try";
              console.log(coll);
          }
          else
          {
              console.log("here");
          }

           // var coll = pdata['choose' + boxNum];
           var pname = pdata['name' + boxNum];
           var purl = pdata['url' + boxNum];
           var pimage = pdata['image' + boxNum];

           delete_mongo(coll, pname, purl, pimage,
               function() {
                   show_collection(coll, name, function(output) {
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
        var newData = {"name" : pname, "url" : purl, "image" : pimage};

            //inserting the new data
            collection.insertOne(newData, function(err, res) {
                if (err) {
                    console.log("querry error: " + err);
                    return;
                }
                console.log(newData);
                // alert(newData["name"] + " added to " + collection);
            });

        //db.close(); --> must close in node.js with ^C
    });
}

function delete_mongo(coll, pname, purl, pimage, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if(err) { return console.log(err); return;}

        //opening the database and collection
        var dbo = db.db("Recipe_Book");
        var collection = dbo.collection(coll);
        var newData = {"name" : pname, "url" : purl, "image" : pimage};

            //deleting the data
            collection.deleteMany(newData, function(err, res) {
                if (err) {
                    console.log("querry error: " + err);
                    return;
                }
                console.log(newData);
                callback();
            });

        //db.close(); --> must close in node.js with ^C
    });
}

function show_collection(coll, header_name, callback) {
  var output = "";

  MongoClient.connect(url, {useUnifiedTopology : true}, function(err, db) {
      if(err) { console.log(err); return;}
      var dbo = db.db('Recipe_Book');
      var collection = dbo.collection(coll);

      collection.find({}).toArray(function(err, result) {
          if (err) throw err;

          output += "<head><style>body{background-image: url('https://photos.smugmug.com/photos/i-pM4SXgb/0/d6b50170/M/i-pM4SXgb-M.jpg');";
          output += "background-repeat: no-repeat;background-attachment: fixed;background-size: cover;}</style></head>";
          output += "<h1 style = 'background-color: #f74a4a; text-align: center;";
          output += "padding: 30px; top: 0; left:0; width: 100%; z-index: 2;";
          output += "text-shadow: -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px -1px 0 #FFFFFF;'>";
          output += header_name + "</h1><br>";
          output += "<form method='post' action='http://localhost:8080/'>";
          // output += "<form method='post' action='https://codebloodedfinal.herokuapp.com/'>";
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
              output += "<a href='" + result[i]["url"] + "' target='_blank'>" + result[i]["name"] + "</a><br>";
              output += "<img src='" + result[i]["image"] + "'><br>";
              output += "<form method='post' action='http://localhost:8080/delete'>";
              // output += "<form method='post' action='https://codebloodedfinal.herokuapp.com/delete'>";
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

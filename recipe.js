var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;
var readline = require('readline');
const url = "mongodb+srv://cate1344:Cad94010@cluster0.tbm9v.mongodb.net/assignment_14?retryWrites=true&w=majority";  // connection string goes here
var port = process.env.PORT || 3000;

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
 /*
    else if (req.url == "/recipes")
    {
            file = "recipe.html";
            fs.readFile(file, function(err, text) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(text);
                res.end();
            });
    }*/
    else if (req.url == "/display")
    {
            file = "display.html";
            console.log(req);
            alert(req);
            fs.readFile(file, function(err, text) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(text);
                res.end();
            });
    }

}).listen(port);

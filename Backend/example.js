var Connection = require('tedious').Connection;


var express = require("express");
var bodyParser = require("body-parser");
var sql = require("tedious");
var cors = require('cors');
var app = express();

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const async = require("async");

let servers = require('./server');
//https://www.robinwieruch.de/node-express-server-rest-api
// Body Parser Middleware
app.use(bodyParser.json());
app.use(cors());

//Setting up server
var server = app.listen(process.env.PORT || 8000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});





app.get('/users', (req, res) => {
    console.log(req.query);

});

app.post('/users', (req, res) => {


    let category = Object.values(req.query);

    return res.send(servers.getTribeLogsDiscord(category));

});


app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});

app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
        id,
    };

    messages[id] = message;

    return res.send(message);
});




var Connection = require('tedious').Connection;


var express = require("express");
var bodyParser = require("body-parser");
var sql = require("tedious");
var cors = require('cors');
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(cors());

//Setting up server
var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.get('/TribeLogs', function (req, res) {

   executeStatement()
    res.send('tribelogs');
});





var config = {
    server: 'localhost',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'local123', //update me
            password: 'local123'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'ArkData'  //update me
    }
};
var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log("Connected");
});

connection.connect();

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


function executeStatement() {
    console.log("jell0")
    request = new Request("SELECT * from TribeLogsVal;", function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });

    connection.execSql(request);
}

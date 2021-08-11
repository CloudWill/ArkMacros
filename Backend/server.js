var Connection = require('tedious').Connection;

var sql = require("tedious");


var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const async = require("async");





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

let results = [];


var connection = new Connection(config);

function queryDatabase(query) {

    // Read all rows from table
    const request = new Request(query, (err, rowCount) => {
        if (err) {
            //callback(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
            //callback(null);
        }
    });

    request.on("row", (columns) => {
        let result = {}
        columns.forEach((column) => {

            result[column.metadata.colName] = column.value
            //console.log("%s\t%s", column.metadata.colName, column.value);
        });
        // save result into an array
        results.push(result)
    });
    connection.execSql(request);
    return results
}



//gets the category ids
function updateTribeLogsDiscord(queryResults) {

    console.log(`query is ${queryResults}`)

}


function getTribeLogsDiscord(categories) {

    let query = 'SELECT * FROM TribeLogsVal WHERE DiscordBot = 0';

    if (categories.length !== 0) {
        query = `SELECT * FROM TribeLogsVal WHERE DiscordBot = 0 AND CategoryId IN (Select CategoryId from Category  WHERE CategoryName IN (${categories}))`;
    }

    results = queryDatabase(query)
    console.log(results)

    //sets all the discord messages to read
    updateTribeLogsDiscord(results);

    return results;
}

function Complete(err, result) {
    if (err) {
        callback(err);
    } else {
        connection.close();
        console.log("close connection");
    }
}

connection.on("connect", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected");

        // Execute all functions in the array serially
        async.waterfall([queryDatabase], Complete);
    }
});

connection.connect();

module.exports = { getTribeLogsDiscord};
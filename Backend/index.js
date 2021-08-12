var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express();


var db = require("./example");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(cors());

//reads from .env
const dotenv = require('dotenv');
dotenv.config();

//Setting up server
var server = app.listen(process.env.PORT || 8000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});




app.get('/', (req, res) => {
    res.send('Server is working');

});

//app.post('/TribeLogDataForDiscord', (req, res) => {
//    //let category = Object.values(req.query);
//    //    return res.send(servers.GetTribeLogsDiscord(category));
//    servers.GetTribeLogsDiscord(category)
//});


app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
        id,
    };

    messages[id] = message;

    return res.send(message);
});



/* GET comments. */
app.get('/test', function (req, res) {
    let categories = Object.values(req.query);

    return res.send();

});


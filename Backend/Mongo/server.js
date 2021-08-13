const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient, Logger } = require("mongodb")
const app = express()

// Updates environment variables
require('./dotenv')
//connection string
const connectionString = process.env.DB_URL

function Logs(text) {
    console.log(Date().toLocaleString(), ':', text)
}

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')


        const db = client.db(process.env.DBNAME)
        const arkTribeLogs = db.collection(process.env.DBCOLLECTION)

        // ========================
        // Middlewares
        // ========================
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.use(express.static('public'))

        // ========================
        // Routes
        // ========================
        app.get('/', (req, res) => {
            arkTribeLogs.find().toArray()
                .then(msg => {
                    res.render('index.ejs', { InGameDate: msg, Msg: msg })
                })
                .catch(/* ... */)
        })

        app.post('/InsertArkTribeLogs', async (req, res) => {
            Logs('Ark Logs Accessed')
            // Get JSON from request
            json = req.body
            //gets all the tribe messages
            try {
                formatted = JSON.parse(json.ArkMsg)
                //Logs(formatted)
                //goes through each entry to add to collection
                for (var key in formatted) {
                    var item = formatted[key];
                    //gets the data. If specific key, use the following format formatted[key].InGameDate
                    day = item.InGameDate
                    category = item.Category
                    filter = { Category: category, InGameDate: day }

                    let exists = await arkTribeLogs.countDocuments(filter);

                    //if item does not exist, insert
                    if (!exists) {
                        arkTribeLogs.insertOne(item, function (err, result) {
                            if (err) {
                                Logs(err);
                            }
                        })
                    }
                };
            }

            catch (err) {
                console.error(err)
            }
            return res.send('Success');
        });

        app.get('/GetArkLogsDiscord', (req, res) => {
            Logs('GetArkLogsDiscord')
            //gets the categories required
            json = req.body
            //gets all the tribe messages
            try {
                let isEmpty = Object.keys(json).length === 0 && json.constructor === Object;
                let filter = { DiscordRead: 0 };

                if (isEmpty) {
                    arkTribeLogs.find(filter).toArray(function (err, data) {
                        res.send(data);
                    });
                }
                else {
                    formatted = JSON.parse(json.MsgCategories)
                    //add the cateogies to an array
                    let items = [];
                    for (var key in formatted) {
                        let cat = formatted[key].MsgCategory
                        //console.log(cat);
                        items.push(cat);
                    }

                    //creates the filter object
                    filter = { DiscordRead: 0, Category: { $in: items } }
                    arkTribeLogs.find(filter).toArray(function (err, data) {
                        res.send(data);
                    });
                }
            }
            catch (err) {
                console.error(err)
            }
            // return res.send('hi');
        });

        app.put('/UpdateDiscordRead', (req, res) => {
            Logs('UpdateDiscordRead')
            //gets the categories required
            json = req.body
            //gets all the tribe messages
            //if no categories
            try {
                let isEmpty = Object.keys(json).length === 0 && json.constructor === Object;
                let filter = { DiscordRead: 0 };
                Logs(isEmpty)
                Logs(json)

                if (isEmpty) {
                    arkTribeLogs.updateMany(filter,
                        {
                            $set: { "DiscordRead": 1 },
                            $currentDate: { lastModified: true }
                        });
                }
                else {
                    formatted = JSON.parse(json.MsgCategories)
                    //add the cateogies to an array
                    let items = [];
                    for (var key in formatted) {
                        let cat = formatted[key].MsgCategory
                        //console.log(cat);
                        items.push(cat);
                    }

                    //creates the filter object
                    filter = { DiscordRead: 0, Category: { $in: items } }
                    Logs(filter)
                    arkTribeLogs.updateMany(filter,
                        {
                            $set: { "DiscordRead": 1 },
                            $currentDate: { lastModified: true }
                        })
                }
                

            }
            catch (err) {
            }
            return res.send('hi');

        })
        // ========================
        // Listen
        // ========================
        const port = process.env.PORT || 3000
        app.listen(port, function () {
            console.log(`listening on ${port}`)
        })
    })
    .catch(console.error)

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
        const arkFriendlys = db.collection(process.env.DBFRIENDLYCOLLECTION)
        const arkEnemies = db.collection(process.env.DBENEMYCOLLECTION)
        const arkServers = db.collection(process.env.DBESERVERCOLLECTION)
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

        app.get('/Allies', (req, res) => {
            arkFriendlys.find().toArray()
                .then(msg => {
                    res.render('allies.ejs', { steam_name: msg, ign: msg, battlemetrics_id: msg, notes: msg })
                })
                .catch(/* ... */)
        })
        app.get('/AlliesApi', (req, res) => {
            arkFriendlys.find().toArray()
                .then(msg => {
                    res.send(msg)
                })
                .catch(/* ... */)
        })

        app.post('/AddAllies', (req, res) => {
            arkFriendlys.insertOne(req.body)
                .then(result => {
                    res.redirect('/Allies')
                })
                .catch(error => console.error(error))
        })

        app.post('/DeleteAllies', (req, res) => {
            arkFriendlys.deleteOne(
                { steam_name: req.body.steam_name }
            )
                .then(result => {
                    res.redirect('/Allies')
                })
                .catch(error => console.error(error))
        })

        app.get('/Enemies', (req, res) => {
            arkEnemies.find().toArray()
                .then(msg => {
                    res.render('enemies.ejs', { steam_name: msg, ign:msg, battlemetrics_id: msg, notes: msg })
                })
                .catch(/* ... */)
        })

        app.get('/EnemiesApi', (req, res) => {
            arkEnemies.find().toArray()
                .then(msg => {
                    res.send(msg)
                })
                .catch(/* ... */)
        })

        app.post('/AddEnemies', (req, res) => {
            arkEnemies.insertOne(req.body)
                .then(result => {
                    res.redirect('/Enemies')
                })
                .catch(error => console.error(error))
        })

        app.post('/DeleteEnemies', (req, res) => {
            arkEnemies.deleteOne(
                { steam_name: req.body.steam_name }
            )
                .then(result => {
                    res.redirect('/Enemies')
                })
                .catch(error => console.error(error))
        })

        app.get('/Servers', (req, res) => {
            arkServers.find().toArray()
                .then(msg => {
                    res.render('servers.ejs', { server_name: msg, server_id: msg})
                })
                .catch(/* ... */)
        })

        app.get('/ServersApi', (req, res) => {
            arkServers.find().toArray()
                .then(msg => {
                    res.send(msg)
                })
                .catch(/* ... */)
        })

        app.post('/AddServers', (req, res) => {
            console.log(req.body)
            arkServers.insertOne(req.body)
                .then(result => {
                    res.redirect('/Servers')
                })
                .catch(error => console.error(error))
        })

        app.post('/DeleteServers', (req, res) => {
            console.log(req.body)
            arkServers.deleteOne(
                { server_name: req.body.server_name }
            )
                .then(result => {
                    res.redirect('/Servers')
                })
                .catch(error => console.error(error))
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

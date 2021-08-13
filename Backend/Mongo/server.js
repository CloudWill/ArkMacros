const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient, Logger } = require("mongodb")
const app = express()

// Updates environment variables
require('./dotenv')
//connection string
const connectionString = process.env.DB_URL


MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')


        const db = client.db(process.env.DBNAME)
        const quotesCollection = db.collection(process.env.DBCOLLECTION)

        // ========================
        // Middlewares
        // ========================
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.use(express.static('public'))
        //make the uploaded files publicly accessible from anywhere, just make the uploads directory static:
        app.use(express.static('uploads'));



        // ========================
        // Routes
        // ========================
        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(msg => {
                    res.render('index.ejs', { InGameDate: msg, Msg: msg })
                })
                .catch(/* ... */)
        })

        app.get('/test', (req, res) => {

            var myobj = { name: "Company Inc", quote: "Highway 37" };

            db.collection("customers").insertOne(myobj).then(result => {
                res.redirect('/')
            })
                .catch(error => console.error(error))
        })

        app.post('/ArkLogs', (req, res) => {
            // Get JSON from request
            json = req.body
            //gets all the tribe messages
            try {
                formatted = JSON.parse(json.ArkMsg)
                //goes through each entry to add to collection
                for (var key in formatted) {
                    var item = formatted[key];
                    console.log(item);
                    //gets the data. If specific key, use the following format formatted[key].InGameDate
                    quotesCollection.insertOne(item, function (err, result) {
                        if (err)
                            console.log('Error');
                    });
                }
            }
            catch (err) {
                console.error(err)
            }
            return res.send('Success');
        });

        app.get('/ArkLogsTest', (req, res) => {

            //gets the categories required
            json = req.body

            //gets all the tribe messages
            try {
                formatted = JSON.parse(json.MsgCategories)
                //add the cateogies to an array
                let items = [];
                for (var key in formatted) {
                    let cat = formatted[key].MsgCategory
                    //console.log(cat);
                    items.push(cat);
                }

                //creates the filter object
                filter = { Cat: { $in: items } }
                quotesCollection.find(filter).toArray(function (err, data) {
                    res.send(data);
                });

            }
            catch (err) {
                console.error(err)
            }
            // return res.send('hi');
        });

        app.put('/UpdateDiscordRead', (req, res) => {
            //gets all the tribe messages
            try {
                formatted = JSON.parse(json.MsgCategories)
                //add the cateogies to an array
                let items = [];
                for (var key in formatted) {
                    let cat = formatted[key].MsgCategory
                    //console.log(cat);
                    items.push(cat);
                }

                //creates the filter object
                filter = { Cat: { $in: items } }

 
                quotesCollection.updateMany(filter,
                    {
                        $set: { "DiscordRead": 1},
                        $currentDate: { lastModified: true }
                    })

            }
            catch (err) {
                console.error(err)
            }
            return res.send('hi');
          
        })





        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => res.json('Success'))
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vadar\'s quote')
                })
                .catch(error => console.error(error))
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

const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

//reads from .env
const dotenv = require('dotenv');
dotenv.config();
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

        // ========================
        // Routes
        // ========================
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(quotes => {
                    res.render('index.ejs', { quotes: quotes })
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

                //quotesCollection.updateMany(
                //    { "Cat": { $eq: "froze" } },
                //    {
                //        $set: { "DiscordRead": 1,},
                //        $currentDate: { lastModified: true }
                //    }
                //)



            }
            catch (err) {
                console.error(err)
            }
            return res.send('Success');
        });

        app.get('/ArkLogs', (req, res) => {
            ////finds all [ in categoriy]
            filter = {
                "Cat": { $all: ["killed"] }
            };
            console.log(quotesCollection.find(filter).getCollection(process.env.DBCOLLECTION));
             return res.send(quotesCollection.find(filter).getCollection(process.env.DBCOLLECTION));
        });


        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
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

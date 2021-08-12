const { Connection, Request } = require('tedious');

const dotenv = require('dotenv');

console.log('starting');
hello();

function hello() {
    console.log('hello world');
    //reads from .env
    dotenv.config();



    var config = {
        server: process.env.DBSERVER,  //update me
        authentication: {
            type: 'default',
            options: {
                userName: process.env.DBUSER, //update me
                password: process.env.DBPASS  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: process.env.DBDATABASE  //update me
        }
    };

    const connection = new Connection(config);

    connection.on('connect', (err) => {
        if (err) {
            console.log('connection err');
            throw err;
        }
        console.log('connecint');
        createTable();
    });
    console.log('done');
    // Creating new table called [dbo].[test_transact]
    //--------------------------------------------------------------------------------
    function createTable() {
        console.log('uupdating');
        const sql = ` UPDATE
                    TribeLogsVal
                SET
                    DiscordBot = 1`;
        const request = new Request(sql, (err, rowCount) => {
            if (err) {
                console.log('error occured!');
                throw err;
            }

            console.log(`Updated`);

            //createTransaction();
        });

        connection.execSql(request);
    }

    // Setting up SQL Command
    //--------------------------------------------------------------------------------
    function createTransaction() {
        const sql = `INSERT INTO ${table} VALUES ('1')`;

        const request = new Request(sql, (err, rowCount) => {
            if (err) {
                console.log('Insert failed');
                throw err;
            }

            console.log('new Request cb');

            // Call connection.beginTransaction() method in this 'new Request' call back function
            beginTransaction();
        });

        connection.execSql(request);
    }

    // SQL: Begin Transaction
    //--------------------------------------------------------------------------------
    function beginTransaction() {
        console.log('beginning');

        connection.beginTransaction((err) => {
            if (err) {
                // If error in begin transaction, roll back!
                rollbackTransaction(err);
            } else {
                console.log('beginTransaction() done');
                // If no error, commit transaction!
                commitTransaction();
            }
        });
    }

    // SQL: Commit Transaction (if no errors)
    //--------------------------------------------------------------------------------
    function commitTransaction() {
        console.log('commiting');
        connection.commitTransaction((err) => {
            if (err) {
                console.log('commit transaction err: ', err);
            }
            console.log('commitTransaction() done!');
            console.log('DONE!');
            connection.close();
        });
    }

    // SQL: Rolling Back Transaction - due to errors during transaction process.
    //--------------------------------------------------------------------------------
    function rollbackTransaction(err) {
        console.log('rollback');
        console.log('transaction err: ', err);
        connection.rollbackTransaction((err) => {
            if (err) {
                console.log('transaction rollback error: ', err);
            }
        });
        connection.close();
    }

}

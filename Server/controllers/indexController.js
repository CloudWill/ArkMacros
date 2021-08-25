var Ally = require('../models/ally');
var Enemy = require('../models/enemy');
var Server = require('../models/server');

const { body, validationResult } = require("express-validator");

var async = require('async');

exports.index = function (req, res) {

    async.parallel({
        ally_count: function (callback) {
            Ally.countDocuments({}, callback);
        },
        enemy_count: function (callback) {
            Enemy.countDocuments({}, callback);
        },
        server_count: function (callback) {
            Server.countDocuments({}, callback);
        },
    }, function (err, results) {
        res.render('index', { title: 'Ark App Home', error: err, data: results });
    });
};

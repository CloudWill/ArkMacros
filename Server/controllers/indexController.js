var Player = require('../models/player');
var Tribe = require('../models/tribe');
var Servercluster = require('../models/servercluster');
var Alignment = require('../models/alignment');
var Server = require('../models/server');

const { body, validationResult } = require("express-validator");

var async = require('async');

exports.index = function (req, res) {

    async.parallel({
        player_count: function (callback) {
            Player.countDocuments({}, callback);
        },
        tribe_count: function (callback) {
            Tribe.countDocuments({}, callback);
        },
        alignment_count: function (callback) {
            Alignment.countDocuments({}, callback);
        },
        servercluster_count: function (callback) {
            Servercluster.countDocuments({}, callback);
        },
        server_count: function (callback) {
            Server.countDocuments({}, callback);
        },
    }, function (err, results) {
        res.render('index', { title: 'Ark App Home', error: err, data: results });
    });
};

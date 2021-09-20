var Player = require('../models/player')
var Tribe = require('../models/tribe')
var async = require('async')
var Helper = require('../utility/helperfunctions')

const { body, validationResult } = require("express-validator");


function get_players_filter_alignment(req, res, next, val, api) {
    const filter =
        [{
            $lookup:
            {
                from: "tribes",
                localField: "tribe",
                foreignField: "_id",
                as: "tribe"
            },
        },
        {
            $lookup:
            {
                from: "alignments",
                localField: "tribe.alignment",
                foreignField: "_id",
                as: "alignments"
            }
        },
        {
            $lookup:
            {
                from: "serverclusters",
                localField: "tribe.servercluster",
                foreignField: "_id",
                as: "serverclusters"
            }
        }       


        ];
    //only filter if exists
    if (!val.includes('All')) {
        filter.push({ $match: { "alignments.alignment_name": { $in: val } } })
    }
    filter.push({ $sort: { "steam_name": 1} })

    Player.aggregate(filter)
        .exec(function (err, list_players) {
            if (err) { return next(err) }
            else {
                // Successful, so render
                if (api === true) {
                    res.send(list_players);
                }
                else {
                    res.render('player_list', { title: val + ' List', player_list: list_players });
                }
            }
        });
};

// Display detail page.
exports.player_detail = function (req, res, next) {
    async.parallel({
        player: function (callback) {
            Player.findById(req.params.id).populate('tribe')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.player == null) { // No results.
            var err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('player_details', { title: 'Player Detail', player: results.player });
    });

}

// Display lists
exports.player_list = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['All'], false)
};

exports.ally_list = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['Ally'], false)
};

exports.neutral_list = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['Neutral'], false)
};

exports.enemy_list = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['Enemy'], false)
};


// Display detail page.
exports.player_detail = function (req, res, next) {
    async.parallel({
        player: function (callback) {
            Player.findById(req.params.id).populate('tribe')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.player == null) { // No results.
            var err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('player_details', { title: 'Player Detail', player: results.player });
    });
};

// Display Players create form on GET.
exports.player_create_get = function (req, res, next) {

    // Get all tribe, which we can use for adding to our player
    async.parallel({
        tribes: function (callback) {
            Tribe.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('player_form', { title: 'Create Player', tribes: results.tribes });
    });
};

// Handle Players create on POST.
exports.player_create_post = [

    (req, res, next) => {
        // Convert to an array.
        req.body.tribe = Helper.convert_to_array(req.body.tribe);
        next();
    },

    // Validate and sanitize fields.
    body('steam_name').trim().isLength({ min: 1 }).escape().withMessage('steam name must be specified.'),
    body('tribe.*').escape(),
    body('ign').trim(),
    body('battlemetrics_id', 'Invalid numeric entry').optional({ checkFalsy: true }).isNumeric(),
    body('notes', 'invalid note entry').optional({ checkFalsy: true }),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create Players object with escaped and trimmed data
        var player = new Player(
            {
                steam_name: req.body.steam_name,
                tribe: req.body.tribe,
                ign: req.body.ign,
                battlemetrics_id: req.body.battlemetrics_id,
                notes: req.body.notes,
            }
        );


        if (!errors.isEmpty()) {
            // Get all tribes
            async.parallel({
                tribes: function (callback) {
                    Tribe.find(callback);
                }
            }, function (err, results) {
                if (err) { return next(err); }
                // Mark our selected as checked.
                results.tribes = Helper.error_mark_as_checked(results.tribes, player.alignment);
                res.render('player_form', { title: 'Create Player', tribes: results.tribes, player: player, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Alignment with same name already exists.
            Player.findOne({ 'battlemetrics_id': req.body.battlemetrics_id })
                .exec(function (err, found_player) {
                    if (err) { return next(err); }

                    if (found_player) {
                        // exists, redirect to its detail page.
                        res.redirect(found_player.url);
                    }
                    else {

                        // Data from form is valid.
                        // Save Players.
                        player.save(function (err) {
                            if (err) { return next(err); }
                            console.log('redirecting')
                            // Successful - redirect to new Players record.
                            res.redirect(player.url);
                        });

                    }

                });
        }
    }
];
// Display Players delete form on GET.
exports.player_delete_get = function (req, res, next) {

    async.parallel({
        player: function (callback) {
            Player.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.player == null) { // No results.
            res.redirect('/catalog/player');
        }
        // Successful, so render.
        res.render('player_delete', { title: 'Delete Player', player: results.player });
    });

};

// Handle Players delete on POST.
exports.player_delete_post = function (req, res, next) {

    async.parallel({
        player: function (callback) {
            Player.findById(req.body.playerid).populate('tribe').exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.

        // Players has no books. Delete object and redirect to the list of Playerss.
        Player.findByIdAndRemove(req.body.playerid, function deletePlayer(err) {
            if (err) { return next(err); }
            // Success - go to Players list.
            res.redirect('/catalog/players')

        })
    });
};

// Display Players update form on GET.
exports.player_update_get = function (req, res, next) {

    async.parallel({
        player: function (callback) {
            Player.findById(req.params.id).populate('tribe').exec(callback);
        },
        tribes: function (callback) {
            Tribe.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.player == null) { // No results.
            var err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected as checked.
        results.tribes = Helper.mark_as_checked(results.tribes, results.player.tribe);
        res.render('player_form', { title: 'Update Player', tribes: results.tribes, player: results.player });
    });
};

// Handle Players update on POST.
exports.player_update_post = [

    // Validate and santize fields.
    body('steam_name').trim().isLength({ min: 1 }).escape().withMessage('steam name must be specified.'),
    body('tribe.*').escape(),
    body('ign').trim(),
    body('battlemetrics_id', 'Invalid numeric entry').optional({ checkFalsy: true }).isNumeric(),
    body('notes', 'invalid note entry').optional({ checkFalsy: true }),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Players object with escaped and trimmed data (and the old id)
        var player = new Player(
            {
                steam_name: req.body.steam_name,
                tribe: req.body.tribe,
                ign: req.body.ign,
                battlemetrics_id: req.body.battlemetrics_id,
                notes: req.body.notes,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            async.parallel({
                players: function (callback) {
                    Player.find(callback);
                }
            }, function (err, results) {
                if (err) { return next(err); }


                res.render('player_form', { title: 'Update Player', tribes: results.tribes, player, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Player.findByIdAndUpdate(req.params.id, player, {}, function (err, thePlayers) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thePlayers.url);
            });
        }
    }
];


// APIs for lists
exports.api_get_allies = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['Ally'], true)
};

exports.api_get_enemies = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['Enemy'], true)
};

exports.api_get_all = function (req, res, next) {
    get_players_filter_alignment(req, res, next, ['All'], true)
};

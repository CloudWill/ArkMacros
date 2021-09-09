var Tribe = require('../models/tribe')
var async = require('async')
var Player = require('../models/player')
var Alignment = require('../models/alignment')
var Servercluster = require('../models/servercluster')

const { body, validationResult } = require("express-validator");

//Displays all
exports.tribe_list = function (req, res, next) {

    Tribe.find()
        .populate('alignment servercluster')
        .sort([['tribe_name', 'ascending']])
        .exec(function (err, list_tribes) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('tribe_list', { title: 'Tribe List', tribe_list: list_tribes });
        })

};

// Display detail page
exports.tribe_detail = function (req, res, next) {

    async.parallel({
        tribe: function (callback) {
            Tribe.findById(req.params.id).populate('alignment servercluster')
                .exec(callback)
        },
        tribes_players: function (callback) {
            Player.find({ 'tribe': req.params.id }, 'steam_name ign battlemetrics_id notes')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.tribe == null) { // No results.
            var err = new Error('Tribe not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('tribe_detail', { title: 'Tribe Detail', tribe: results.tribe, tribe_players: results.tribes_players});
    });

};

// Display create form on GET.
exports.tribe_create_get = function (req, res, next) {

    // Get all details
    async.parallel({
        alignments: function (callback) {
            Alignment.find(callback);
        },
        serverclusters: function (callback) {
            Servercluster.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('tribe_form', { title: 'Create Tribe', alignments: results.alignments, serverclusters: results.serverclusters});
    });    
};

// Handle create on POST.
exports.tribe_create_post = [

    // Convertto an array.
    (req, res, next) => {
        if (!(req.body.alignment instanceof Array)) {
            if (typeof req.body.alignment === 'undefined') {
                req.body.alignment = [];
            }
            else {
                req.body.alignment = new Array(req.body.alignment);
            }
        }
        next();
    },
    // Convert to an array.
    (req, res, next) => {
        if (!(req.body.servercluster instanceof Array)) {
            if (typeof req.body.servercluster === 'undefined') {
                req.body.servercluster = [];
            }
            else {
                req.body.servercluster = new Array(req.body.servercluster);
            }
        }
        next();
    },

    // Validate and sanitize fields.
    body('tribe_name').trim().isLength({ min: 1 }).escape().withMessage('Tribe name must be specified.'),
    body('alignment.*').escape(),
    body('servercluster.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create object with escaped and trimmed data
        var tribe = new Tribe(
            {
                tribe_name: req.body.tribe_name,
                alignment: req.body.alignment,
                servercluster: req.body.servercluster,
            }
        );
        if (!errors.isEmpty()) {

            async.parallel({
                alignments: function (callback) {
                    Alignment.find(callback);
                },
                serverclusters: function (callback) {
                    Servercluster.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                // Mark our selected as checked.
                for (let i = 0; i < results.alignments.length; i++) {
                    if (tribe.alignment.indexOf(results.alignments[i]._id) > -1) {
                        results.alignments[i].checked = 'true';
                    }
                }
                // Mark our selected as checked.
                for (let i = 0; i < results.serverclusters.length; i++) {
                    if (tribe.servercluster.indexOf(results.serverclusters[i]._id) > -1) {
                        results.serverclusters[i].checked = 'true';
                    }
                }
                // There are errors. Render form again with sanitized values/errors messages.
                res.render('tribe_form', { title: 'Create Tribe', tribe: results.tribe, alignments: results.alignment, serverclusters: results.serverclusters, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid.
            // Save.
            tribe.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new record.
                res.redirect(tribe.url);
            });
        }
    }
];

// Display delete form on GET.
exports.tribe_delete_get = function (req, res, next) {

    async.parallel({
        tribe: function (callback) {
            Tribe.findById(req.params.id).exec(callback)
        },
        tribes_players: function (callback) {
            Player.find({ 'tribe': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.tribe == null) { // No results.
            res.redirect('/catalog/tribes');
        }
        // Successful, so render.
        res.render('tribe_delete', { title: 'Delete Tribe', tribe: results.tribe, tribe_players: results.tribes_players});
    });

};

// Handle delete on POST.
exports.tribe_delete_post = function (req, res, next) {

    async.parallel({
        tribe: function (callback) {
            Tribe.findById(req.body.tribeid).exec(callback)
        },
        tribes_players: function (callback) {
            Player.find({ 'tribe': req.body.tribeid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.tribes_players.length > 0) {
            // Tribe has players. Render in same way as for GET route.
            res.render('tribe_delete', { title: 'Delete Tribe', tribe: results.tribe, tribe_players: results.tribes_players });
            return;
        }
        else {
            // Tribe has no players. Delete object and redirect to the list of tribes.
            Tribe.findByIdAndRemove(req.body.tribeid, function deleteTribe(err) {
                if (err) { return next(err); }
                // Success - go to list.
                res.redirect('/catalog/tribes')
            })

        }
    });

};

// Display update form on GET.
exports.tribe_update_get = function (req, res, next) {
    // Get data for form.
    async.parallel({
        tribe: function (callback) {
            Tribe.findById(req.params.id).populate('alignment').exec(callback);
        },
        alignments: function (callback) {
            Alignment.find(callback);
        },
        serverclusters: function (callback) {
            Servercluster.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.tribe == null) { // No results.
            var err = new Error('Tribe not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selectedas checked.
        for (var all_iter = 0; all_iter < results.alignments.length; all_iter++) {
            for (var tribe_iter = 0; tribe_iter < results.tribe.alignment.length; tribe_iter++) {
                if (results.alignments[all_iter]._id.toString() === results.tribe.alignment[tribe_iter]._id.toString()) {
                    results.alignments[all_iter].checked = 'true';
                }
            }
        }
        for (var all_iter = 0; all_iter < results.serverclusters.length; all_iter++) {
            for (var tribe_iter = 0; tribe_iter < results.tribe.servercluster.length; tribe_iter++) {
                if (results.serverclusters[all_iter]._id.toString() === results.tribe.servercluster[tribe_iter]._id.toString()) {
                    results.serverclusters[all_iter].checked = 'true';
                }
            }
        }
        res.render('tribe_form', { title: 'Update Tribe', tribe: results.tribe, alignments: results.alignments, serverclusters: results.serverclusters });
    });
};

// Handle update on POST.
exports.tribe_update_post = [

    // Validate and santize fields.
    body('tribe_name').trim().isLength({ min: 1 }).escape().withMessage('Tribe name must be specified.'),
    body('alignment.*').escape(),
    body('servercluster.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create object with escaped and trimmed data (and the old id!)
        var tribe = new Tribe(
            {
                tribe_name: req.body.tribe_name,
                alignment: req.body.alignment,
                servercluster: req.body.servercluster,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('tribe_form', { title: 'Update Tribe', tribe: tribe, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Tribe.findByIdAndUpdate(req.params.id, tribe, {}, function (err, thetribe) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thetribe.url);
            });
        }
    }
];
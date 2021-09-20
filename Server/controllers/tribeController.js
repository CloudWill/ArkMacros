var Tribe = require('../models/tribe')
var async = require('async')
var Player = require('../models/player')
var Alignment = require('../models/alignment')
var Servercluster = require('../models/servercluster')
var Server = require('../models/server')
var Helper = require ('../utility/helperfunctions')


const { body, validationResult } = require("express-validator");

//Displays all
exports.tribe_list = function (req, res, next) {

    Tribe.find()
        .populate('alignment servercluster server')
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
            Tribe.findById(req.params.id).populate('alignment servercluster server')
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
        servers: function (callback) {
            Server.find(callback).sort([['server_name', 'ascending']]);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('tribe_form', { title: 'Create Tribe', alignments: results.alignments, serverclusters: results.serverclusters, servers: results.servers});
    });    
};

// Handle create on POST.
exports.tribe_create_post = [
    (req, res, next) => {
        // Convert to an array.
        req.body.alignment = Helper.convert_to_array(req.body.alignment);
        req.body.servercluster = Helper.convert_to_array(req.body.servercluster);
        req.body.server = Helper.convert_to_array(req.body.server);
        next();
    },

    // Validate and sanitize fields.
    body('tribe_name').trim().isLength({ min: 1 }).escape().withMessage('Tribe name must be specified.'),
    body('alignment.*').escape(),
    body('server.*').escape(),
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
                server: req.body.server,
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
                servers: function (callback) {
                    Server.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                // Mark our selected as checked.
                results.alignments = Helper.error_mark_as_checked(results.alignments, tribe.alignment);
                results.alignments = Helper.error_mark_as_checked(results.serverclusters, tribe.servercluster);
                results.alignments = Helper.error_mark_as_checked(results.servers, tribe.server);

                // There are errors. Render form again with sanitized values/errors messages.
                res.render('tribe_form', { title: 'Create Tribe', tribe: results.tribe, alignments: results.alignment, serverclusters: results.serverclusters, servers: results.servers, errors: errors.array() });
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
        servers: function (callback) {
            Server.find(callback).sort([['server_name', 'ascending']]);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.tribe == null) { // No results.
            var err = new Error('Tribe not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected as checked.
        results.alignments = Helper.mark_as_checked(results.alignments, results.tribe.alignment);
        results.serverclusters = Helper.mark_as_checked(results.serverclusters, results.tribe.servercluster);
        results.servers = Helper.mark_as_checked(results.servers, results.tribe.server);
        
        res.render('tribe_form', { title: 'Update Tribe', tribe: results.tribe, alignments: results.alignments, serverclusters: results.serverclusters, servers: results.servers });
    });
};

// Handle update on POST.
exports.tribe_update_post = [

    // Validate and santize fields.
    body('tribe_name').trim().isLength({ min: 1 }).escape().withMessage('Tribe name must be specified.'),
        body('alignment.*').escape(),
        body('servercluster.*').escape(),
        body('server.*').escape(),

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
                    server: req.body.server,
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
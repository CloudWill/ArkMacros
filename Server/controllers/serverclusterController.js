var Servercluster = require('../models/servercluster');
var Server = require('../models/server');
var Tribe = require('../models/tribe');
var async = require('async');

const { body, validationResult } = require("express-validator");

// Display list.
exports.servercluster_list = function (req, res, next) {

    Servercluster.find()
        .sort([['servercluster', 'ascending']])
        .exec(function (err, list_serverclusters) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('servercluster_list', { title: 'Servercluster List', list_serverclusters: list_serverclusters });
        });

};

// Display detail page for a specific Servercluster.
exports.servercluster_detail = function (req, res, next) {

    async.parallel({
        servercluster: function (callback) {
            Servercluster.findById(req.params.id)
                .exec(callback);
        },

        servercluster_servers: function (callback) {
            Server.find({ 'servercluster': req.params.id }).sort([['server_name', 'ascending']])
                .exec(callback);
        },
        tribes: function (callback) {
            Tribe.find({ 'servercluster': req.params.id }).sort([['tribe_name', 'ascending']])
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.servercluster == null) { // No results.
            var err = new Error('Servercluster not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('servercluster_details', { title: 'Servercluster Detail', servercluster: results.servercluster, servercluster_servers: results.servercluster_servers, tribes: results.tribes });
    });

};

// Display Servercluster create form on GET.
exports.servercluster_create_get = function (req, res, next) {
    res.render('servercluster_form', { title: 'Create Servercluster' });
};

// Handle Servercluster create on POST.
exports.servercluster_create_post = [

    // Validate and santise the name field.
    body('servercluster_name', 'Servercluster name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a servercluster object with escaped and trimmed data.
        var servercluster = new Servercluster(
            { servercluster_name: req.body.servercluster_name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('servercluster_form', { title: 'Create Servercluster', servercluster: servercluster, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Servercluster with same name already exists.
            Servercluster.findOne({ 'servercluster_name': req.body.servercluster_name })
                .exec(function (err, found_servercluster) {
                    if (err) { return next(err); }

                    if (found_servercluster) {
                        // Servercluster exists, redirect to its detail page.
                        res.redirect(found_servercluster.url);
                    }
                    else {

                        servercluster.save(function (err) {
                            if (err) { return next(err); }
                            // Servercluster saved. Redirect to servercluster detail page.
                            res.redirect(servercluster.url);
                        });

                    }

                });
        }
    }
];

// Display Servercluster delete form on GET.
exports.servercluster_delete_get = function (req, res, next) {

    async.parallel({
        servercluster: function (callback) {
            Servercluster.findById(req.params.id).exec(callback);
        },
        servercluster_servers: function (callback) {
            Server.find({ 'servercluster': req.params.id }).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.servercluster == null) { // No results.
            res.redirect('/catalog/serverclusters');
        }
        // Successful, so render.
        res.render('servercluster_delete', { title: 'Delete Servercluster', servercluster: results.servercluster, servercluster_servers: results.servercluster_servers });
    });

};

// Handle Servercluster delete on POST.
exports.servercluster_delete_post = function (req, res, next) {

    async.parallel({
        servercluster: function (callback) {
            Servercluster.findById(req.params.id).exec(callback);
        },
        servercluster_servers: function (callback) {
            Server.find({ 'servercluster': req.params.id }).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.servercluster_servers.length > 0) {
            // Servercluster has servers. Render in same way as for GET route.
            res.render('servercluster_delete', { title: 'Delete Servercluster', servercluster: results.servercluster, servercluster_servers: results.servercluster_servers });
            return;
        }
        else {
            // Servercluster has no servers. Delete object and redirect to the list of serverclusters.
            Servercluster.findByIdAndRemove(req.body.id, function deleteServercluster(err) {
                if (err) { return next(err); }
                // Success - go to serverclusters list.
                res.redirect('/catalog/serverclusters');
            });

        }
    });

};

// Display Servercluster update form on GET.
exports.servercluster_update_get = function (req, res, next) {

    Servercluster.findById(req.params.id, function (err, servercluster) {
        if (err) { return next(err); }
        if (servercluster == null) { // No results.
            var err = new Error('Servercluster not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('servercluster_form', { title: 'Update Servercluster', servercluster: servercluster });
    });

};

// Handle Servercluster update on POST.
exports.servercluster_update_post = [

    // Validate and sanitze the name field.
    body('servercluster_name', 'Servercluster name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a servercluster object with escaped and trimmed data (and the old id!)
        var servercluster = new Servercluster(
            {
                servercluster_name: req.body.servercluster_name,
                _id: req.params.id
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('servercluster_form', { title: 'Update Servercluster', servercluster: servercluster, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Servercluster.findByIdAndUpdate(req.params.id, servercluster, {}, function (err, theservercluster) {
                if (err) { return next(err); }
                // Successful - redirect to servercluster detail page.
                res.redirect(theservercluster.url);
            });
        }
    }
];
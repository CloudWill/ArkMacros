var Server = require('../models/server')
var Servercluster = require('../models/servercluster')
var async = require('async')

const { body, validationResult } = require("express-validator");

// Display list of all server.
exports.server_list = function (req, res, next) {

    Server.find()
        .populate('servercluster')
        .sort([['server_name', 'ascending']])
        .exec(function (err, list_servers) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('server_list', { title: 'Server List', server_list: list_servers });
        })

};

// Display detail page for a specific server.
exports.server_detail = function (req, res, next) {

    async.parallel({
        server: function (callback) {
            Server.findById(req.params.id).populate('servercluster')
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.server == null) { // No results.
            var err = new Error('Server not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        console.log(results.enemy);
        res.render('server_details', { title: 'Server Details', server: results.server });
    });

};

// Display server create form on GET.
exports.server_create_get = function (req, res, next) {

    // Get all details
    async.parallel({
        serverclusters: function (callback) {
            Servercluster.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('server_form', { title: 'Create Server', serverclusters: results.serverclusters });
    });
};

// Handle server create on POST.
exports.server_create_post = [
    // Validate and sanitize fields.
    body('server_name').trim().isLength({ min: 1 }).escape().withMessage('server name must be specified.'),
    body('server_id').trim().isLength({ min: 1 }).escape().withMessage('server id must be specified.'),
    body('servercluster.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create enemy object with escaped and trimmed data
        var server = new Server(
            {
                server_name: req.body.server_name,
                server_id: req.body.server_id,
                servercluster: req.body.servercluster
            }
        );

        if (!errors.isEmpty()) {
            console.log('error')
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('server_form', { title: 'Create server', server: server, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            Server.findOne({ 'server_id': req.body.server_id })
                .exec(function (err, found_server) {
                    if (err) { return next(err); }

                    if (found_server) {
                        // exists, redirect to its detail page.
                        res.redirect(found_server.url);
                    }
                    else {
                        // Data from form is valid.
                        // Save
                        server.save(function (err) {
                            if (err) { return next(err); }
                            console.log('redirecting')
                            // Successful - redirect to record
                            res.redirect(server.url);
                        });

                    }

                });
        }
    }
];

// Display server delete form on GET.
exports.server_delete_get = function (req, res, next) {

    async.parallel({
        server: function (callback) {
            Server.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.server == null) { // No results.
            res.redirect('/catalog/servers');
        }
        // Successful, so render.
        res.render('server_delete', { title: 'Delete Server', server: results.server });
    });

};

// Handle server delete on POST.
exports.server_delete_post = function (req, res, next) {

    async.parallel({
        server: function (callback) {
            Server.findById(req.body.serverid).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.

        // enemy has no books. Delete object and redirect to the list of enemys.
        Server.findByIdAndRemove(req.body.serverid, function deleteserver(err) {
            if (err) { return next(err); }
            // Success - go to enemy list.
            res.redirect('/catalog/servers')

        })
    });
};

// Display server update form on GET.
exports.server_update_get = function (req, res, next) {

    // Get data for form.
    async.parallel({
        server: function (callback) {
            Server.findById(req.params.id).populate('servercluster').exec(callback);
        },
        serverclusters: function (callback) {
            Servercluster.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.server == null) { // No results.
            var err = new Error('Server not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selectedas checked.
        for (var all_iter = 0; all_iter < results.serverclusters.length; all_iter++) {
            for (var server_iter = 0; server_iter < results.server.servercluster.length; server_iter++) {
                if (results.serverclusters[all_iter]._id.toString() === results.server.servercluster[server_iter]._id.toString()) {
                    results.serverclusters[all_iter].checked = 'true';
                }
            }
        }
        res.render('server_form', { title: 'Update Server', server: results.server, serverclusters: results.serverclusters });
    });
};

// Handle server update on POST.
exports.server_update_post = [

    // Validate and santize fields.
    body('server_name').trim().isLength({ min: 1 }).escape().withMessage('server name must be specified.'),
    body('server_id').trim().isLength({ min: 1 }).escape().withMessage('server id must be specified.'),
    body('servercluster.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create server object with escaped and trimmed data (and the old id)
        var server = new Server(
            {
                server_name: req.body.server_name,
                server_id: req.body.server_id,
                servercluster: req.body.servercluster,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('server_form', { title: 'Update Server', server: server, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Server.findByIdAndUpdate(req.params.id, server, {}, function (err, theserver) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theserver.url);
            });
        }
    }
];

// API
exports.server_api_get = function (req, res, next) {

    Server.find()
        .sort([['server_name', 'ascending']])
        .exec(function (err, list_server) {
            if (err) { return next(err); }
            // Successful, so render.
            res.send(list_server);
        })
};
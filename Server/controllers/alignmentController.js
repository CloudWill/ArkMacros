var Alignment = require('../models/alignment');
var Tribe = require('../models/tribe');
var async = require('async');

const { body, validationResult } = require("express-validator");

// Display list.
exports.alignment_list = function (req, res, next) {

    Alignment.find()
        .sort([['alignment', 'ascending']])
        .exec(function (err, list_alignments) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('alignment_list', { title: 'Alignment List', list_alignments: list_alignments });
        });

};

// Display detail page for a specific Alignment.
exports.alignment_detail = function (req, res, next) {

    async.parallel({
        alignment: function (callback) {

            Alignment.findById(req.params.id)
                .exec(callback);
        },

        alignment_tribes: function (callback) {
            Tribe.find({ 'alignment': req.params.id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.alignment == null) { // No results.
            var err = new Error('Alignment not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('alignment_details', { title: 'Alignment Details', alignment: results.alignment, alignment_tribes: results.alignment_tribes });
    });

};

// Display Alignment create form on GET.
exports.alignment_create_get = function (req, res, next) {
    res.render('alignment_form', { title: 'Create Alignment' });
};

// Handle Alignment create on POST.
exports.alignment_create_post = [

    // Validate and santise the name field.
    body('alignment_name', 'Alignment name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a alignment object with escaped and trimmed data.
        var alignment = new Alignment(
            { alignment_name: req.body.alignment_name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('alignment_form', { title: 'Create Alignment', alignment: alignment, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Alignment with same name already exists.
            Alignment.findOne({ 'alignment_name': req.body.alignment_name })
                .exec(function (err, found_alignment) {
                    if (err) { return next(err); }

                    if (found_alignment) {
                        // Alignment exists, redirect to its detail page.
                        res.redirect(found_alignment.url);
                    }
                    else {

                        alignment.save(function (err) {
                            if (err) { return next(err); }
                            // Alignment saved. Redirect to alignment detail page.
                            res.redirect(alignment.url);
                        });

                    }

                });
        }
    }
];

// Display Alignment delete form on GET.
exports.alignment_delete_get = function (req, res, next) {

    async.parallel({
        alignment: function (callback) {
            Alignment.findById(req.params.id).exec(callback);
        },
        alignment_tribes: function (callback) {
            Tribe.find({ 'alignment': req.params.id }).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.alignment == null) { // No results.
            res.redirect('/catalog/alignments');
        }
        // Successful, so render.
        res.render('alignment_delete', { title: 'Delete Alignment', alignment: results.alignment, alignment_tribes: results.alignment_tribes });
    });

};

// Handle Alignment delete on POST.
exports.alignment_delete_post = function (req, res, next) {

    async.parallel({
        alignment: function (callback) {
            Alignment.findById(req.params.id).exec(callback);
        },
        alignment_tribes: function (callback) {
            Tribe.find({ 'alignment': req.params.id }).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.alignment_tribes.length > 0) {
            // Alignment has tribes. Render in same way as for GET route.
            res.render('alignment_delete', { title: 'Delete Alignment', alignment: results.alignment, alignment_tribes: results.alignment_tribes });
            return;
        }
        else {
            // Alignment has no tribes. Delete object and redirect to the list of alignments.
            Alignment.findByIdAndRemove(req.body.id, function deleteAlignment(err) {
                if (err) { return next(err); }
                // Success - go to alignments list.
                res.redirect('/catalog/alignments');
            });

        }
    });

};

// Display Alignment update form on GET.
exports.alignment_update_get = function (req, res, next) {

    Alignment.findById(req.params.id, function (err, alignment) {
        if (err) { return next(err); }
        if (alignment == null) { // No results.
            var err = new Error('Alignment not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('alignment_form', { title: 'Update Alignment', alignment: alignment });
    });

};

// Handle Alignment update on POST.
exports.alignment_update_post = [

    // Validate and sanitze the name field.
    body('alignment_name', 'Alignment name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a alignment object with escaped and trimmed data (and the old id!)
        var alignment = new Alignment(
            {
                alignment_name: req.body.alignment_name,
                _id: req.params.id
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('alignment_form', { title: 'Update Alignment', alignment: alignment, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Alignment.findByIdAndUpdate(req.params.id, alignment, {}, function (err, thealignment) {
                if (err) { return next(err); }
                // Successful - redirect to alignment detail page.
                res.redirect(thealignment.url);
            });
        }
    }
];
var Discordsettings = require('../models/discordsettings');
var async = require('async');

const { body, validationResult } = require("express-validator");

// Handle Alignment create on POST.
exports.alignment_create_post = [

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a alignment object with escaped and trimmed data.
        var discordsettings = new Discordsettings(
            { last_active: req.body.alignment_name }
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

];
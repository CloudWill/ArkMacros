var Ally = require('../models/ally')
var async = require('async')

const { body,validationResult } = require("express-validator");

// Display list of all Alliess.
exports.ally_list = function (req, res, next) {

    Ally.find()
        .sort([['steam_name', 'ascending']])
        .exec(function (err, list_allies) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('ally_list', { title: 'Allies List', ally_list: list_allies });
        })

};

// Display detail page for a specific Allies.
exports.ally_detail = function (req, res, next) {

    async.parallel({
        ally: function (callback) {
            Ally.findById(req.params.id)
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.ally == null) { // No results.
            var err = new Error('Ally not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        console.log(results.ally);
        res.render('ally_details', { title: 'Ally Detail', ally: results.ally});
    });

};

// Display Allies create form on GET.
exports.ally_create_get = function (req, res, next) {
    res.render('ally_form', { title: 'Create Ally' });
};

// Handle Allies create on POST.
exports.ally_create_post = [
    // Validate and sanitize fields.
    body('steam_name').trim().isLength({ min: 1 }).escape().withMessage('steam name must be specified.'),
    body('ign').trim(),
    body('battlemetrics_id', 'Invalid numeric entry').optional({ checkFalsy: true }).isNumeric(),
    body('notes', 'invalid note entry').optional({ checkFalsy: true }),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Allies object with escaped and trimmed data
        var ally = new Ally(
            {
                steam_name: req.body.steam_name,
                ign: req.body.ign,
                battlemetrics_id: req.body.battlemetrics_id,
                notes: req.body.notes,
            }
        );

        if (!errors.isEmpty()) {
            console.log('error')
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('ally_form', { title: 'Create Ally', ally: ally, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save Allies.
            ally.save(function (err) {
                if (err) { return next(err); }
                console.log('redirecting')
                // Successful - redirect to new Allies record.
                res.redirect(ally.url);
            });
        }
    }
];



// Display Allies delete form on GET.
exports.ally_delete_get = function (req, res, next) {

    async.parallel({
        ally: function (callback) {
            Ally.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.ally == null) { // No results.
            res.redirect('/catalog/ally');
        }
        // Successful, so render.
        res.render('ally_delete', { title: 'Delete Ally', ally: results.ally});
    });

};

// Handle Allies delete on POST.
exports.ally_delete_post = function (req, res, next) {

    async.parallel({
        ally: function (callback) {
            Ally.findById(req.body.allyid).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.

        // Allies has no books. Delete object and redirect to the list of Alliess.
        Ally.findByIdAndRemove(req.body.allyid, function deleteAlly(err) {
            if (err) { return next(err); }
            // Success - go to Allies list.
            res.redirect('/catalog/allies')

        })
    });
};

// Display Allies update form on GET.
exports.ally_update_get = function (req, res, next) {

    Ally.findById(req.params.id, function (err, ally) {
        if (err) { return next(err); }
        if (ally == null) { // No results.
            var err = new Error('Ally not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('ally_form', { title: 'Update Ally', ally: ally });

    });
};

// Handle Allies update on POST.
exports.ally_update_post = [

    // Validate and santize fields.
    body('steam_name').trim().isLength({ min: 1 }).escape().withMessage('steam name must be specified.'),
    body('ign').trim(),
    body('battlemetrics_id', 'Invalid numeric entry').optional({ checkFalsy: true }).isNumeric(),
    body('notes', 'invalid note entry').optional({ checkFalsy: true }),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Allies object with escaped and trimmed data (and the old id)
        var ally = new Ally(
            {
                steam_name: req.body.steam_name,
                ign: req.body.ign,
                battlemetrics_id: req.body.battlemetrics_id,
                notes: req.body.notes,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('ally_form', { title: 'Update Ally', ally: ally, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Ally.findByIdAndUpdate(req.params.id, ally, {}, function (err, theAllies) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theAllies.url);
            });
        }
    }
];

// API
exports.ally_api_get = function (req, res, next) {

    Ally.find()
        .sort([['steam_name', 'ascending']])
        .exec(function (err, list_allies) {
            if (err) { return next(err); }
            // Successful, so render.
            res.send(list_allies);
        })
};
var Enemy = require('../models/enemy')
var async = require('async')

const { body,validationResult } = require("express-validator");

// Display list of all enemys.
exports.enemy_list = function (req, res, next) {

    Enemy.find()
        .sort([['steam_name', 'ascending']])
        .exec(function (err, list_Enemies) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('enemy_list', { title: 'Enemies List', enemy_list: list_Enemies });
        })

};

// Display detail page for a specific enemy.
exports.enemy_detail = function (req, res, next) {

    async.parallel({
        enemy: function (callback) {
            Enemy.findById(req.params.id)
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.enemy == null) { // No results.
            var err = new Error('enemy not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        console.log(results.enemy);
        res.render('enemy_details', { title: 'enemy Detail', enemy: results.enemy});
    });

};

// Display enemy create form on GET.
exports.enemy_create_get = function (req, res, next) {
    res.render('enemy_form', { title: 'Create enemy' });
};

// Handle enemy create on POST.
exports.enemy_create_post = [
    // Validate and sanitize fields.
    body('steam_name').trim().isLength({ min: 1 }).escape().withMessage('steam name must be specified.'),
    body('ign').trim(),
    body('battlemetrics_id', 'Invalid numeric entry').optional({ checkFalsy: true }).isNumeric(),
    body('notes', 'invalid note entry').optional({ checkFalsy: true }),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create enemy object with escaped and trimmed data
        var enemy = new Enemy(
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
            res.render('enemy_form', { title: 'Create enemy', enemy: enemy, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save enemy.
            enemy.save(function (err) {
                if (err) { return next(err); }
                console.log('redirecting')
                // Successful - redirect to new enemy record.
                res.redirect(enemy.url);
            });
        }
    }
];

// Display enemy delete form on GET.
exports.enemy_delete_get = function (req, res, next) {

    async.parallel({
        enemy: function (callback) {
            Enemy.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.enemy == null) { // No results.
            res.redirect('/catalog/enemy');
        }
        // Successful, so render.
        res.render('enemy_delete', { title: 'Delete enemy', enemy: results.enemy});
    });

};

// Handle enemy delete on POST.
exports.enemy_delete_post = function (req, res, next) {

    async.parallel({
        enemy: function (callback) {
            Enemy.findById(req.body.enemyid).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.

        // enemy has no books. Delete object and redirect to the list of enemys.
        Enemy.findByIdAndRemove(req.body.enemyid, function deleteenemy(err) {
            if (err) { return next(err); }
            // Success - go to enemy list.
            res.redirect('/catalog/enemies')

        })
    });
};

// Display enemy update form on GET.
exports.enemy_update_get = function (req, res, next) {

    Enemy.findById(req.params.id, function (err, enemy) {
        if (err) { return next(err); }
        if (enemy == null) { // No results.
            var err = new Error('enemy not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('enemy_form', { title: 'Update enemy', enemy: enemy });

    });
};

// Handle enemy update on POST.
exports.enemy_update_post = [

    // Validate and santize fields.
    body('steam_name').trim().isLength({ min: 1 }).escape().withMessage('steam name must be specified.'),
    body('ign').trim(),
    body('battlemetrics_id', 'Invalid numeric entry').optional({ checkFalsy: true }).isNumeric(),
    body('notes', 'invalid note entry').optional({ checkFalsy: true }),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create enemy object with escaped and trimmed data (and the old id)
        var enemy = new Enemy(
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
            res.render('enemy_form', { title: 'Update enemy', enemy: enemy, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Enemy.findByIdAndUpdate(req.params.id, enemy, {}, function (err, theenemy) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theenemy.url);
            });
        }
    }
];

// API
exports.enemy_api_get = function (req, res, next) {

    Enemy.find()
        .sort([['steam_name', 'ascending']])
        .exec(function (err, list_enemies) {
            if (err) { return next(err); }
            // Successful, so render.
            res.send(list_enemies);
        })
};
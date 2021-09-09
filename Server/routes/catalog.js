
var express = require('express');
var router = express.Router();


// Require our controllers.
var index_controller = require('../controllers/indexController');
var server_controller = require('../controllers/serverController');
var player_controller = require('../controllers/playerController');
var tribe_controller = require('../controllers/tribeController');
var alignment_controller = require('../controllers/alignmentController');
var servercluster_controller = require('../controllers/serverclusterController');

/// ROUTES ///

// GET catalog home page.
router.get('/', index_controller.index);


/// ALLY ROUTES ///




/// PLAYER ROUTES ///

// GET request for creating. NOTE This must come before route for id (i.e. display ).
router.get('/player/create', player_controller.player_create_get);

// POST request for creating.
router.post('/player/create', player_controller.player_create_post);

// GET request to delete.
router.get('/player/:id/delete', player_controller.player_delete_get);

// POST request to delete
router.post('/player/:id/delete', player_controller.player_delete_post);

// GET request to update.
router.get('/player/:id/update', player_controller.player_update_get);

// POST request to update.
router.post('/player/:id/update', player_controller.player_update_post);

// GET request for one
router.get('/player/:id', player_controller.player_detail);

// GET request for list of all players
router.get('/players', player_controller.player_list);

// GET request for list of all Allys.
router.get('/allies', player_controller.ally_list);

// GET request for list of all enemy.
router.get('/enemies', player_controller.enemy_list);

// GET request for list of all neutrals
router.get('/neutrals', player_controller.neutral_list);


/// TRIBE ROUTES ///

// GET request for creating. NOTE This must come before route for id (i.e. display ).
router.get('/tribe/create', tribe_controller.tribe_create_get);

// POST request for creating.
router.post('/tribe/create', tribe_controller.tribe_create_post);

// GET request to delete.
router.get('/tribe/:id/delete', tribe_controller.tribe_delete_get);

// POST request to delete
router.post('/tribe/:id/delete', tribe_controller.tribe_delete_post);

// GET request to update.
router.get('/tribe/:id/update', tribe_controller.tribe_update_get);

// POST request to update.
router.post('/tribe/:id/update', tribe_controller.tribe_update_post);

// GET request for one
router.get('/tribe/:id', tribe_controller.tribe_detail);

// GET request for list of all 
router.get('/tribes', tribe_controller.tribe_list);


//SERVER ROUTES
router.get('/server/create', server_controller.server_create_get);

router.post('/server/create', server_controller.server_create_post);

router.get('/server/:id/delete', server_controller.server_delete_get);

router.post('/server/:id/delete', server_controller.server_delete_post);

router.get('/server/:id/update', server_controller.server_update_get);

router.post('/server/:id/update', server_controller.server_update_post);

router.get('/server/:id', server_controller.server_detail);

router.get('/servers', server_controller.server_list);

//ALIGNMENT ROUTES
router.get('/alignment/create', alignment_controller.alignment_create_get);

router.post('/alignment/create', alignment_controller.alignment_create_post);

router.get('/alignment/:id/delete', alignment_controller.alignment_delete_get);

router.post('/alignment/:id/delete', alignment_controller.alignment_delete_post);

router.get('/alignment/:id/update', alignment_controller.alignment_update_get);

router.post('/alignment/:id/update', alignment_controller.alignment_update_post);

router.get('/alignment/:id', alignment_controller.alignment_detail);

router.get('/alignments', alignment_controller.alignment_list);

// SERVER CLUSTER ROUTES
router.get('/servercluster/create', servercluster_controller.servercluster_create_get);

router.post('/servercluster/create', servercluster_controller.servercluster_create_post);

router.get('/servercluster/:id/delete', servercluster_controller.servercluster_delete_get);

router.post('/servercluster/:id/delete', servercluster_controller.servercluster_delete_post);

router.get('/servercluster/:id/update', servercluster_controller.servercluster_update_get);

router.post('/servercluster/:id/update', servercluster_controller.servercluster_update_post);

router.get('/servercluster/:id', servercluster_controller.servercluster_detail);

router.get('/serverclusters', servercluster_controller.servercluster_list);




// APIs
router.get('/api/get_ally_players', player_controller.api_get_allies);
router.get('/api/get_enemy_players', player_controller.api_get_enemies);

router.get('/servers/api', server_controller.server_api_get);

module.exports = router;
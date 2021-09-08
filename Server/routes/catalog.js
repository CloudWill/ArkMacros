
var express = require('express');
var router = express.Router();


// Require our controllers.
var ally_controller = require('../controllers/allyController');
var index_controller = require('../controllers/indexController');
var enemy_controller = require('../controllers/enemyController');
var server_controller = require('../controllers/serverController');
var player_controller = require('../controllers/playerController');
var tribe_controller = require('../controllers/tribeController');
var alignment_controller = require('../controllers/alignmentController');
var servercluster_controller = require('../controllers/serverclusterController');

/// ROUTES ///

// GET catalog home page.
router.get('/', index_controller.index);


/// ALLY ROUTES ///

// GET request for creating Ally. NOTE This must come before route for id (i.e. display ally).
router.get('/ally/create', ally_controller.ally_create_get);

// POST request for creating Ally.
router.post('/ally/create', ally_controller.ally_create_post);

// GET request to delete Ally.
router.get('/ally/:id/delete', ally_controller.ally_delete_get);

// POST request to delete Ally
router.post('/ally/:id/delete', ally_controller.ally_delete_post);

// GET request to update Ally.
router.get('/ally/:id/update', ally_controller.ally_update_get);

// POST request to update Ally.
router.post('/ally/:id/update', ally_controller.ally_update_post);

// GET request for one Ally.
router.get('/ally/:id', ally_controller.ally_detail);

// GET request for list of all Allys.
router.get('/allies', ally_controller.ally_list);


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

// GET request for list of all 
router.get('/players', player_controller.player_list);

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

// GET request for creating enemy. NOTE This must come before route for id (i.e. display enemy).
router.get('/enemy/create', enemy_controller.enemy_create_get);

// POST request for creating enemy.
router.post('/enemy/create', enemy_controller.enemy_create_post);

// GET request to delete enemy.
router.get('/enemy/:id/delete', enemy_controller.enemy_delete_get);

// POST request to delete enemy
router.post('/enemy/:id/delete', enemy_controller.enemy_delete_post);

// GET request to update enemy.
router.get('/enemy/:id/update', enemy_controller.enemy_update_get);

// POST request to update enemy.
router.post('/enemy/:id/update', enemy_controller.enemy_update_post);

// GET request for one enemy.
router.get('/enemy/:id', enemy_controller.enemy_detail);

// GET request for list of all enemy.
router.get('/enemies', enemy_controller.enemy_list);

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
//router.get('/servercluster/create', servercluster_controller.servercluster_create_get);

//router.post('/servercluster/create', servercluster_controller.servercluster_create_post);

//router.get('/servercluster/:id/delete', servercluster_controller.servercluster_delete_get);

//router.post('/servercluster/:id/delete', servercluster_controller.servercluster_delete_post);

//router.get('/servercluster/:id/update', servercluster_controller.servercluster_update_get);

//router.post('/servercluster/:id/update', servercluster_controller.servercluster_update_post);

//router.get('/servercluster/:id', servercluster_controller.servercluster_detail);

//router.get('/serverclusters', servercluster_controller.servercluster_list);




// APIs
router.get('/allies/api', ally_controller.ally_api_get);
router.get('/enemies/api', enemy_controller.enemy_api_get);
router.get('/servers/api', server_controller.server_api_get);

module.exports = router;
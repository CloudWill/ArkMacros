
var express = require('express');
var router = express.Router();


// Require our controllers.
var ally_controller = require('../controllers/allyController');
var index_controller = require('../controllers/indexController');
var enemy_controller = require('../controllers/enemyController');
var server_controller = require('../controllers/serverController');


/// BOOK ROUTES ///

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


router.get('/server/create', server_controller.server_create_get);

router.post('/server/create', server_controller.server_create_post);

router.get('/server/:id/delete', server_controller.server_delete_get);

router.post('/server/:id/delete', server_controller.server_delete_post);

router.get('/server/:id/update', server_controller.server_update_get);

router.post('/server/:id/update', server_controller.server_update_post);

router.get('/server/:id', server_controller.server_detail);

router.get('/servers', server_controller.server_list);


// APIs
router.get('/allies/api', ally_controller.ally_api_get);
router.get('/enemies/api', enemy_controller.enemy_api_get);
router.get('/servers/api', server_controller.server_api_get);

module.exports = router;
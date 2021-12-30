'use strict';
const router = require('express').Router();
const userCtrl = require('../controllers/user.controller');
const articleCtrl = require('../controllers/article.controller');


/**User routes */
router.post('/user', userCtrl.add);
router.get('/user', userCtrl.list);
router.get('/user/:id', userCtrl.getById);
router.put('/user/:id', userCtrl.update);
router.delete('/user/:id', userCtrl.delete);

/**Article routes */
router.post('/article', articleCtrl.add);
router.get('/article', articleCtrl.list);
router.get('/article/:id', articleCtrl.getById);
router.put('/article/:id', articleCtrl.update);
router.delete('/article/:id', articleCtrl.delete);


module.exports = router;

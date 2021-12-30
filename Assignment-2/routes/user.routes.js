'use strict';
const router = require('express').Router();
const userCtrl = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/list-users', protect, userCtrl.listUsers);

router.get('/find-user/:userId', protect, userCtrl.userById, userCtrl.findUser);

router.put('/update-user/:userId', protect, userCtrl.userById, userCtrl.updateUser);

router.delete('/delete-user/:userId', protect, userCtrl.userById, userCtrl.deleteUser);

module.exports = router;

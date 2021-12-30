'use strict';
const router = require('express').Router();
const productCtrl = require('../controllers/product.controller');

router.post('/product', productCtrl.add);

router.get('/product', productCtrl.list);

router.put('/product/:id', productCtrl.update);

router.delete('/product/:id', productCtrl.delete);

router.post('/products', productCtrl.bulkAdd);

router.get('/search', productCtrl.search);

module.exports = router;
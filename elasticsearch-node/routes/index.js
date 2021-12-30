'use strict';
const router = require('express').Router();
const productCtrl = require('../controllers/product.controller');
const newsCtrl = require('../controllers/news.controller');

router.put('/product/create', productCtrl.create);
router.post('/product', productCtrl.add);
router.get('/product', productCtrl.list);
router.get('/product/transactions_by_month', productCtrl.transactionsByMonth)
router.get('/product/transactions_per_day', productCtrl.listDailyRevenue);
router.get('/product/invoice-stats', productCtrl.invoiceStats);
router.get('/product/unique-customers', productCtrl.uniqueCustomers);
router.get('/product/invoice-histogram', productCtrl.invoiceHistogram);
router.get('/product/daily-revenue', productCtrl.dailyRevenue);

router.post('/test', productCtrl.test);


router.put('/news/create', newsCtrl.create);
router.get('/news', newsCtrl.list);
router.get('/news/search-text', newsCtrl.searchText);
router.get('/news/news-between-dates', newsCtrl.newBetweenDates);
router.get('/news/match-text', newsCtrl.matchText);



module.exports = router;

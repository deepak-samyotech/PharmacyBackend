const express = require('express');
const purchaseController = require('../controller/purchase');

const router = express.Router();

router
    .post('/', purchaseController.post)
    .get('/', purchaseController.get)
    .get('/todayPurchase', purchaseController.getTodayPurchase)
    .get('/purchaseBilling', purchaseController.getPurchaseBilling)
    .put('/:id', purchaseController.put)
    .delete('/:id', purchaseController.delete);

exports.router = router;  
const express = require('express');
const purchaseController = require('../controller/purchase');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router
    .post('/', verifyJWT, purchaseController.post)
    .get('/', purchaseController.get)
    .get('/todayPurchase', purchaseController.getTodayPurchase)
    .get('/purchaseBilling', purchaseController.getPurchaseBilling)
    .put('/:id', purchaseController.put)
    .delete('/:id', purchaseController.delete);

exports.router = router;  
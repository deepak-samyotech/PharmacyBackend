const verifyJWT = require('../controller/auth/auth.middleware');
const manageInvoiceController = require('../controller/manageInvoice');
const express = require('express');
const router = express.Router();

router
    .post('/', verifyJWT, manageInvoiceController.post)
    .get('/', manageInvoiceController.get)
    .get('/todaySale', manageInvoiceController.getTodaySale)
    .get('/totalSale', manageInvoiceController.getTotalSale)
    .get('/:id', manageInvoiceController.getInvoice)
    .put('/:id', manageInvoiceController.put)
    .delete('/:id', manageInvoiceController.delete);

exports.router = router;  
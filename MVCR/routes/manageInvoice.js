const manageInvoiceController = require('../controller/manageInvoice');
const express = require('express');
const router = express.Router();

router
    .post('/', manageInvoiceController.post)
    .get('/', manageInvoiceController.get)
    .get('/todaySale', manageInvoiceController.getTodaySale)
    .get('/totalSale', manageInvoiceController.getTotalSale)
    .get('/:id', manageInvoiceController.getInvoice)
    .put('/:id', manageInvoiceController.put)
    .delete('/:id', manageInvoiceController.delete);

exports.router = router;  
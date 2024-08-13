const express = require('express');
const saleReturnController = require('../controller/sale_return');

const router = express.Router();

router
    .post('/', saleReturnController.post)
    .get('/', saleReturnController.get)
    .put('/:id', saleReturnController.put)
    .delete('/:id', saleReturnController.delete);

module.exports = router;

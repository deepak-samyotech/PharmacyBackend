const express = require('express');
const saleReturnController = require('../controller/sale_return');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router
    .post('/', saleReturnController.post)
    .get('/', saleReturnController.get)
    .put('/:id', saleReturnController.put)
    .delete('/:id', saleReturnController.delete);

module.exports = router;

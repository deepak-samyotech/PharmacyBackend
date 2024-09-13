const express = require('express');
const purchaseReturnController = require('../controller/purchase_return');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router
    .post('/', purchaseReturnController.post)
    .get('/', purchaseReturnController.get)
    .put('/:id', purchaseReturnController.put)
    .delete('/:id', purchaseReturnController.delete);

module.exports = router;

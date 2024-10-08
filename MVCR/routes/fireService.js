const express = require('express');
const fireServiceController = require('../controller/fireService');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router
    .post('/', fireServiceController.post)
    .get('/', fireServiceController.get)
    .put('/:id', fireServiceController.put)
    .delete('/:id', fireServiceController.delete);

exports.router = router;  
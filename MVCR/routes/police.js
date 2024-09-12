const express = require('express');
const policeController = require('../controller/police');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router
    .post('/', verifyJWT, policeController.post)
    .get('/', policeController.get)
    .put('/:id', policeController.put)
    .delete('/:id', policeController.delete);

exports.router = router;  
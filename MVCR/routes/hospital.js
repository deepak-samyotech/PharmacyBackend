const express = require('express');
const hospitalController = require('../controller/hospital');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router
    .post('/', verifyJWT, hospitalController.post)
    .get('/', hospitalController.get)
    .put('/:id', hospitalController.put)
    .delete('/:id', hospitalController.delete);

exports.router = router;  
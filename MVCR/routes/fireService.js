const express = require('express');
const fireServiceController = require('../controller/fireService');

const router = express.Router();

router
    .post('/', fireServiceController.post)
    .get('/', fireServiceController.get)
    .put('/:id', fireServiceController.put)
    .delete('/:id', fireServiceController.delete);

exports.router = router;  
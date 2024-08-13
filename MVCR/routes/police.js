const express = require('express');
const policeController = require('../controller/police');

const router = express.Router();

router
    .post('/', policeController.post)
    .get('/', policeController.get)
    .put('/:id', policeController.put)
    .delete('/:id', policeController.delete);

exports.router = router;  
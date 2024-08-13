const express = require('express');
const hospitalController = require('../controller/hospital');

const router = express.Router();

router
    .post('/', hospitalController.post)
    .get('/', hospitalController.get)
    .put('/:id', hospitalController.put)
    .delete('/:id', hospitalController.delete);

exports.router = router;  
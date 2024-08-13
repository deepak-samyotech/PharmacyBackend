const express = require('express');
const doctorController = require('../controller/doctor');

const router = express.Router();

router
    .post('/', doctorController.post)
    .get('/', doctorController.get)
    .put('/:id', doctorController.put)
    .delete('/:id', doctorController.delete);

exports.router = router;  
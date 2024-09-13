const express = require('express');
const doctorController = require('../controller/doctor');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router
    .post('/', doctorController.post)
    .get('/', doctorController.get)
    .put('/:id', doctorController.put)
    .delete('/:id', doctorController.delete);

exports.router = router;  
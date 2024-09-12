const express = require('express');
const ambulaceController = require('../controller/ambulance');
const verifyJWT = require('../controller/auth/auth.middleware');

const router = express.Router();

router
    .post('/', verifyJWT,ambulaceController.post)
    .get('/', ambulaceController.get)
    .put('/:id', ambulaceController.put)
    .delete('/:id', ambulaceController.delete);

exports.router = router;  
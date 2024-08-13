const express = require('express');
const ambulaceController = require('../controller/ambulance');

const router = express.Router();

router
    .post('/', ambulaceController.post)
    .get('/', ambulaceController.get)
    .put('/:id', ambulaceController.put)
    .delete('/:id', ambulaceController.delete);

exports.router = router;  
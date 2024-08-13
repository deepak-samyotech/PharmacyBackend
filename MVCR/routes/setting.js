const express = require('express');
const settingController = require('../controller/setting');

const router = express.Router();

router
    .post('/', settingController.post)
    .get('/', settingController.get)
    .put('/:id', settingController.put)
    .delete('/:id', settingController.delete);

exports.router = router;  
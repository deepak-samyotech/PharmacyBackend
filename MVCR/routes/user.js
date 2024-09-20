const express = require("express");
const router = express.Router();
const userController = require('../controller/user');

router.get('/:id', userController.get);

exports.router = router;
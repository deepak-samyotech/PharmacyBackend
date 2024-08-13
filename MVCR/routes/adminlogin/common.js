const express = require('express');
const { authenticate } = require('../../controller/auth/common');

const router = express.Router();

router.post("/auth", authenticate);

module.exports = router;

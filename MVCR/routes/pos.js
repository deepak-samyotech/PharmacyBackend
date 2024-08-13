const express = require("express");

const PosController = require("../controller/pos")

const router = express.Router();

router.post("/set_value", PosController.post)

exports.router = router;
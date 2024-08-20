const express = require("express");

const PosController = require("../controller/pos")

const router = express.Router();

router.post("/set_value", PosController.post)
    .get("/", PosController.get)
    .put("/:id", PosController.put)
    .delete("/:id", PosController.delete);

exports.router = router;
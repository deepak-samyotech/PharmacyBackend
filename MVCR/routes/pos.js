const express = require("express");

const PosController = require("../controller/pos");
const verifyJWT = require("../controller/auth/auth.middleware");

const router = express.Router();

router.post("/set_value", verifyJWT, PosController.post)
    .get("/", PosController.get)
    .put("/:id", PosController.put)
    .delete("/:id", PosController.delete);

exports.router = router;
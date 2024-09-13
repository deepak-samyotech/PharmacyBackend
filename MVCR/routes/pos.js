const express = require("express");

const PosController = require("../controller/pos");
const verifyJWT = require("../controller/auth/auth.middleware");

const router = express.Router();

router.use(verifyJWT);

router.post("/set_value",  PosController.post)
    .get("/", PosController.get)
    .put("/:id", PosController.put)
    .delete("/:id", PosController.delete);

exports.router = router;
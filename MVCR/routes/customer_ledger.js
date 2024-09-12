const express = require("express");
const customer_ledgerController = require("../controller/customer_ledger");
const multer = require('multer');
const verifyJWT = require("../controller/auth/auth.middleware");
const upload = multer();

const router = express.Router();


router
  .post("/", verifyJWT, customer_ledgerController.post) // Use upload.single() to handle single file upload
  .get("/", customer_ledgerController.get)
  .put("/:id", upload.none() ,customer_ledgerController.put)
  .delete("/:id", customer_ledgerController.delete)

exports.router = router;


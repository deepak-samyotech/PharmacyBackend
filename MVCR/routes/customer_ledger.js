const express = require("express");
const customer_ledgerController = require("../controller/customer_ledger");

const router = express.Router();


router
  .post("/", customer_ledgerController.post) // Use upload.single() to handle single file upload
  .get("/", customer_ledgerController.get)
  .put("/:id", customer_ledgerController.put)
  .delete("/:id", customer_ledgerController.delete)

exports.router = router;


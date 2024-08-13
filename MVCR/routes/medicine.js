const express = require("express");
const medicineController = require("../controller/medicine");
const multer = require("multer");

const router = express.Router();
const upload = multer(); // Initialize multer

router
  .post("/", medicineController.post) 
  .get("/", medicineController.get)
  .get("/s-data/:data", medicineController.getSupplierData)
  .get("/bySupplierName", medicineController.getBySupplierName)
  .get('/search', medicineController.search)
  .put("/:id", medicineController.put)
  .delete("/:id", medicineController.delete)

exports.router = router;

const express = require("express");
const medicineController = require("../controller/medicine");
const multer = require("multer");
const verifyJWT = require("../controller/auth/auth.middleware");

const router = express.Router();
const upload = multer(); // Initialize multer

router.use(verifyJWT);

router
  .post("/", medicineController.post)
  .get("/", medicineController.get)
  .get("/s-data/:data", medicineController.getSupplierData)
  .get("/bySupplierName", medicineController.getBySupplierName)
  .get('/search', medicineController.search)
  .put("/updateQuantity", medicineController.updateQuantity)
  .put("/:id", medicineController.put)
  .delete("/:id", medicineController.delete)

exports.router = router;

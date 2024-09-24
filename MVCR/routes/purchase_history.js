const express = require("express");
const purchaseHistoryController = require("../controller/purchase_history");
const verifyJWT = require("../controller/auth/auth.middleware");
const multer = require("multer");

const router = express.Router();
const upload = multer();

router.use(verifyJWT);

router
  .post("/", upload.none(), purchaseHistoryController.post) 
  .get("/", purchaseHistoryController.get)
  .put("/:id", upload.none(), purchaseHistoryController.put)
  .delete("/:id", purchaseHistoryController.delete)
  .get('/search', purchaseHistoryController.search)
  


exports.router = router;


const express = require("express");
const purchaseHistoryController = require("../controller/purchase_history");
const verifyJWT = require("../controller/auth/auth.middleware");

const router = express.Router();


router
  .post("/", verifyJWT, purchaseHistoryController.post) 
  .get("/", purchaseHistoryController.get)
  .put("/:id", purchaseHistoryController.put)
  .delete("/:id", purchaseHistoryController.delete)
  .get('/search', purchaseHistoryController.search)
  


exports.router = router;


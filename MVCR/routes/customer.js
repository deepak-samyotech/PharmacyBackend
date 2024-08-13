const express = require("express");
const customerController = require("../controller/customer");

const router = express.Router();


router
  .post("/", customerController.post) // Use upload.single() to handle single file upload
  .get("/", customerController.get)
  .put("/:id", customerController.put)
  .delete("/:id", customerController.delete)
  .get('/search', customerController.search)
  


exports.router = router;


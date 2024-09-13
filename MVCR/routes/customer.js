const express = require("express");
const customerController = require("../controller/customer");
const  verifyJWT  = require("../controller/auth/auth.middleware");

const router = express.Router();

router.use(verifyJWT);

router
  .post("/", customerController.post) // Use upload.single() to handle single file upload
  .get("/", customerController.get)
  .put("/:id", customerController.put)
  .delete("/:id", customerController.delete)
  .get('/search', customerController.search)
  


exports.router = router;


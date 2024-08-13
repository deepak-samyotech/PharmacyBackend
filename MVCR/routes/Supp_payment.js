const express = require("express");
const supp_paymentController = require("../controller/Supp_payment");
const multer = require("multer");
const router = express.Router();
// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination directory for uploaded files

router
    .post("/", supp_paymentController.post) // Use upload.single() to handle single file upload
    .get("/", supp_paymentController.get)
    .put("/:id", supp_paymentController.put)
    .delete("/:id", supp_paymentController.delete);

exports.router = router;


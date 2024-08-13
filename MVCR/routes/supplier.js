const express = require("express");
const supplierController = require("../controller/supplier");
const multer = require("multer");
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination directory for uploaded files

router
    .post("/", supplierController.post) // Use upload.single() to handle single file upload
    .get("/", supplierController.get)
    .put("/:id", supplierController.put)
    .delete("/:id", supplierController.delete);

exports.router = router;


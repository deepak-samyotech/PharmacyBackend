const express = require("express");
const closingController = require("../controller/closing");
const multer = require("multer");
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination directory for uploaded files

router
    .post("/", closingController.post) // Use upload.single() to handle single file upload
    .get("/", closingController.get)
    .put("/:id", closingController.put)
    .delete("/:id", closingController.delete);

exports.router = router;

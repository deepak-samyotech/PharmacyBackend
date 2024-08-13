const express = require("express");
const bankController = require("../controller/bank");
const multer = require("multer");
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination directory for uploaded files

router
    .post("/", bankController.post) // Use upload.single() to handle single file upload
    .get("/", bankController.get)
    .put("/:id", bankController.put)
    .delete("/:id", bankController.delete);

exports.router = router;

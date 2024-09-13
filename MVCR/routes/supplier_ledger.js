const express = require("express");
const supplier_ledgerController = require("../controller/supplier_ledger");
const multer = require("multer");
const verifyJWT = require("../controller/auth/auth.middleware");
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination directory for uploaded files

router.use(verifyJWT);

router
    .post("/", supplier_ledgerController.post) // Use upload.single() to handle single file upload
    .get("/", supplier_ledgerController.get)
    .put("/:id", supplier_ledgerController.put)
    .delete("/:id", supplier_ledgerController.delete);

exports.router = router;


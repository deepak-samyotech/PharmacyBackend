const express = require("express");
const closingController = require("../controller/closing");
const multer = require("multer");
const verifyJWT = require("../controller/auth/auth.middleware");
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); 

router.use(verifyJWT);

router
    .post("/", closingController.post) 
    .get("/", closingController.get)
    .put("/:id", closingController.put)
    .delete("/:id", closingController.delete);

exports.router = router;

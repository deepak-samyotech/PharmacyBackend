const express = require("express");
const employeeController = require("../controller/employee");
const multer = require("multer");
const verifyJWT = require("../controller/auth/auth.middleware");
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); 

router
    .post("/", verifyJWT, employeeController.post)
    .get("/", employeeController.get)
    .put("/:id", employeeController.put)
    .delete("/:id", employeeController.delete);

exports.router = router;


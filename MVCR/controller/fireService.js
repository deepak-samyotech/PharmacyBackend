const model = require("../models/fireService");
const mongoose = require("mongoose");
const FireService = model.FireService;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const multer = require("multer");
const upload = multer();
const { validationResult } = require("express-validator");

//  (1.) GET : to find the FireService
exports.get = async (req, res) => {
  try {
    // Fetch data from FireService collection
    const FireServiceLists = await FireService.find();

    if (FireServiceLists && FireServiceLists.length > 0) {
      // Prepare response data
      const data = FireServiceLists.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        contact: item.contact,
        address: item.address,
      }));

      res.status(200).json({
        msg: "data",
        data: data,
      });
      return;
    }

    res.status(200).json({
      message: "FireService List",
      data: FireServiceLists,
      count: FireServiceLists.length,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};
``;

//(2.) POST : to send the data on database
exports.post = async (req, res) => {
  try {
    req.body.file_path = "./public/upload/documents";
    req.body.file_name = "image";
    const respUpload = await uploadSingleFile(req, res);

    console.log("respUpload", respUpload);
    if (respUpload.error !== undefined) {
      return res.status(400).json({ errors: [{ msg: respUpload.message }] });
    }

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await removeUploadImage(respUpload.files);
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from the request body
    const {
      id,
      name,
      email,
      contact,
      address,
    } = req.body;

    console.log("req.body", req.body);
    // Create the new FireService
    let newFireService = new FireService({
      id,
      name,
      email,
      contact,
      address,
    });

    // Save the new FireService to the database
    newFireService = await newFireService.save();
    console.log("newFireService", newFireService);
    res.status(200).json({ newFireService: newFireService });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//(3.) PUT : to update the data on database
exports.put = async (req, res) => {
  try {
    req.body.file_path = "./public/upload/documents";
    req.body.file_name = "image";
    const respUpload = await uploadSingleFile(req, res);

    console.log("respUpload", respUpload);
    if (respUpload.error !== undefined) {
      return res.status(400).json({ errors: [{ msg: respUpload.message }] });
    }

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await removeUploadImage(respUpload.files);
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      id,
      name,
      email,
      contact,
      address,
    } = req.body;

    const updatedData = {
      id,
      name,
      email,
      contact,
      address,
    };

    const updatedFireService = await FireService.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedFireService", updatedFireService);
    res.status(200).json({ updatedFireService: updatedFireService });
    if (!updatedFireService) {
      return res.status(404).json({ message: "FireService not found" });
    }

    // res.json(updatedFireService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteFireServiceData = await FireService.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "FireService data deleted successfully!",
      data: deleteFireServiceData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

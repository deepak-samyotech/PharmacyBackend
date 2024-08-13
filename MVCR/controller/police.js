const model = require("../models/police");
const mongoose = require("mongoose");
const Police = model.Police;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const multer = require("multer");
const upload = multer();
const { validationResult } = require("express-validator");

//  (1.) GET : to find the Police
exports.get = async (req, res) => {
  try {
    // Fetch data from Police collection
    const PoliceLists = await Police.find();

    if (PoliceLists && PoliceLists.length > 0) {
      // Prepare response data
      const data = PoliceLists.map((item) => ({
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
      message: "Police List",
      data: PoliceLists,
      count: PoliceLists.length,
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
    // Create the new Police
    let newPolice = new Police({
      id,
      name,
      email,
      contact,
      address,
    });

    // Save the new Police to the database
    newPolice = await newPolice.save();
    console.log("newPolice", newPolice);
    res.status(200).json({ newPolice: newPolice });
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

    const updatedPolice = await Police.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedPolice", updatedPolice);
    res.status(200).json({ updatedPolice: updatedPolice });
    if (!updatedPolice) {
      return res.status(404).json({ message: "Police not found" });
    }

    // res.json(updatedPolice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deletePoliceData = await Police.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Police data deleted successfully!",
      data: deletePoliceData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

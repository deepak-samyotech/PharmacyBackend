const model = require("../models/hospital");
const mongoose = require("mongoose");
const Hospital = model.Hospital;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const multer = require("multer");
const upload = multer();
const { validationResult } = require("express-validator");

//  (1.) GET : to find the Hospital
exports.get = async (req, res) => {
  try {
    // Fetch data from Hospital collection
    const HospitalLists = await Hospital.find();

    if (HospitalLists && HospitalLists.length > 0) {
      // Prepare response data
      const data = HospitalLists.map((item) => ({
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
      message: "Hospital List",
      data: HospitalLists,
      count: HospitalLists.length,
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
    // Create the new Hospital
    let newHospital = new Hospital({
      id,
      name,
      email,
      contact,
      address,
      company_id: req?.user?._id,
    });

    // Save the new Hospital to the database
    newHospital = await newHospital.save();
    console.log("newHospital", newHospital);
    res.status(200).json({ newHospital: newHospital });
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

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedHospital", updatedHospital);
    res.status(200).json({ updatedHospital: updatedHospital });
    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // res.json(updatedHospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteHospitalData = await Hospital.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Hospital data deleted successfully!",
      data: deleteHospitalData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const model = require("../models/ambulance");
const mongoose = require("mongoose");
const Ambulance = model.Ambulance;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const multer = require("multer");
const upload = multer();
const { validationResult } = require("express-validator");

//  (1.) GET : to find the Ambulance
exports.get = async (req, res) => {
  try {
    // Fetch data from Ambulance collection
    const AmbulanceLists = await Ambulance.find({company_id:req.user?._id});

    if (AmbulanceLists && AmbulanceLists.length > 0) {
      // Prepare response data
      const data = AmbulanceLists.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        contact: item.contact,
        address: item.address,
        hospital_name:item.hospital_name,
        notes:item.notes,
      }));

      res.status(200).json({
        msg: "data",
        data: data,
      });
      return;
    }

    res.status(200).json({
      message: "Ambulance List",
      data: AmbulanceLists,
      count: AmbulanceLists.length,
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
      hospital_name,
      notes,
    } = req.body;

    console.log("req.body", req.body);
    // Create the new Ambulance
    let newAmbulance = new Ambulance({
      id,
      name,
      email,
      contact,
      address,
      hospital_name,
      notes,
      company_id: req?.user?._id,
    });

    // Save the new Ambulance to the database
    newAmbulance = await newAmbulance.save();
    console.log("newAmbulance", newAmbulance);
    res.status(200).json({ newAmbulance: newAmbulance });
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
      hospital_name,
      notes,
    } = req.body;

    const updatedData = {
      id,
      name,
      email,
      contact,
      address,
      hospital_name,
      notes,
    };

    const updatedAmbulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedAmbulance", updatedAmbulance);
    res.status(200).json({ updatedAmbulance: updatedAmbulance });
    if (!updatedAmbulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    // res.json(updatedAmbulance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteAmbulanceData = await Ambulance.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Ambulance data deleted successfully!",
      data: deleteAmbulanceData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

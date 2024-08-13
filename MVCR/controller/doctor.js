const model = require("../models/doctor");
const mongoose = require("mongoose");
const Doctor = model.Doctor;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const multer = require("multer");
const upload = multer();
const { validationResult } = require("express-validator");

//  (1.) GET : to find the Doctor
exports.get = async (req, res) => {
  try {
    // Fetch data from Doctor collection
    const DoctorLists = await Doctor.find();

    if (DoctorLists && DoctorLists.length > 0) {
      // Prepare response data
      const data = DoctorLists.map((item) => ({
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
      message: "Doctor List",
      data: DoctorLists,
      count: DoctorLists.length,
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
    // Create the new Doctor
    let newDoctor = new Doctor({
      id,
      name,
      email,
      contact,
      address,
    });

    // Save the new Doctor to the database
    newDoctor = await newDoctor.save();
    console.log("newDoctor", newDoctor);
    res.status(200).json({ newDoctor: newDoctor });
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

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedDoctor", updatedDoctor);
    res.status(200).json({ updatedDoctor: updatedDoctor });
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteDoctorData = await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Doctor data deleted successfully!",
      data: deleteDoctorData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

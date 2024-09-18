const model = require("../models/supplier");
const Supplier = model.Supplier;
const medicineModel = require("../models/medicine.js");
const Medicine = medicineModel.Medicine;
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const { validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer();
const customId = require("custom-id");

// Function to generate custom employment ID
const generateSupplierId = () => {
  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  // Combine prefix "emp" with the random number
  return `sup${randomNumber}`;
};



//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    // Fetch data from Supplier collection
    const supplierLists = await Supplier.find({ company_id: req.user?._id });

    if (supplierLists && supplierLists.length > 0) {
      // Prepare response data
      const data = supplierLists.map((item) => ({
        id: item.id,
        s_id: item.s_id,
        s_name: item.s_name,
        s_email: item.s_email,
        s_note: item.s_note,
        s_phone: item.s_phone,
        s_address: item.s_address,
        entrydate: item.entrydate,
        status: item.status,
        image: `${process.env.IMAGE_BASE_URL}${item.image}`,
      }));

      // Count total number of suppliers
      const totalSuppliers = supplierLists.length;

      res.status(200).json({
        msg: "Supplier data",
        data: data,
        totalSuppliers: totalSuppliers,
      });
    } else {
      res.status(200).json({
        message: "No data found in Supplier collection",
        totalSuppliers: 0, // If no suppliers found, return count as 0
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

// exports.get = async (req, res) => {
//   try {
//     // Fetch data from Supplier collection
//     const supplierLists = await Supplier.find();

//     if (supplierLists && supplierLists.length > 0) {
//       // Prepare response data
//       const data = supplierLists.map((item) => ({
//         id: item.id,
//         s_id: item.s_id,
//         s_name: item.s_name,
//         s_email: item.s_email,
//         s_note: item.s_note,
//         s_phone: item.s_phone,
//         s_address: item.s_address,
//         entrydate: item.entrydate,
//         status: item.status,
//         image: `${process.env.IMAGE_BASE_URL}${item.image}`,
//       }));

//          // Count total number of suppliers
//          const totalSuppliers = supplierLists.length;

//       res.status(200).json({
//         msg: "Supplier data",
//         data: data,
//         totalSuppliers: totalSuppliers,
//       });
//     } else {
//       res.status(200).json({
//         message: "No data found in Supplier collection",
//       });
//     }
//   } catch (err) {
//     res.status(404).json(err);
//   }
// };

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


    // Generate custom product ID with prefix "med" and 5-digit number
    const s_id = generateSupplierId();

    // Extract data from the request body
    const {
      id,
      s_name,
      s_email,
      s_note,
      s_phone,
      s_address,
      status,
      entrydate,
    } = req.body;

    console.log("req.body", req.body);
    // Create the new supplier
    let newSupplier = new Supplier({
      id,
      s_id,
      s_name,
      s_email,
      s_note,
      s_phone,
      s_address,
      status,
      entrydate,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
      // s_details: {
      //   created_by: 'user123',
      //   updated_by: 'user123',
      // },
      company_id: req.user?._id,
      employee_id:req.user?.emp_id,
    });

    // Save the new supplier to the database
    newSupplier = await newSupplier.save();
    console.log("newSupplier", newSupplier);
    res.status(200).json({ newSupplier: newSupplier });
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
      s_id,
      s_name,
      s_email,
      s_note,
      s_phone,
      s_address,
      status,
      entrydate,
    } = req.body;

    const updatedData = {
      id,
      s_id,
      s_name,
      s_email,
      s_note,
      s_phone,
      s_address,
      entrydate,
      status,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
      employee_id:req.user?.emp_id,
    };

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedSupplier", updatedSupplier);
    res.status(200).json({ updatedSupplier: updatedSupplier });
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteSupplierData = await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Supplier data deleted successfully!",
      data: deleteSupplierData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

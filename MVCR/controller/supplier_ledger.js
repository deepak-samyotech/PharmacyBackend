const model = require("../models/supplier_ledger");
const Supplier_ledger = model.Supplier_ledger;
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

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    // Fetch data from Supplier_ledger collection
    const supplier_ledgerLists = await Supplier_ledger.find({ company_id: req.user?._id });

    if (supplier_ledgerLists && supplier_ledgerLists.length > 0) {
      // Prepare response data
      const data = supplier_ledgerLists.map((item) => ({
        id: item.id,
        supplier_id: item.supplier_id,
        supplier_name: item.supplier_name,
        total_amount: item.total_amount,
        total_paid: item.total_paid,
        total_due: item.total_due,
      }));

      res.status(200).json({
        msg: "Supplier_ledger data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in Supplier_ledger collection",
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

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

    const { id, supplier_id, supplier_name, total_amount, total_paid, total_due } = req.body;

    console.log("req.body", req.body);
    // Create the new Supplier_ledger
    let newSupplier_ledger = new Supplier_ledger({
      id,
      supplier_id,
      supplier_name,
      total_amount,
      total_paid,
      total_due,
      company_id: req.user?._id,
    });

    // Save the new Supplier_ledger to the database
    newSupplier_ledger = await newSupplier_ledger.save();
    console.log("newSupplier_ledger", newSupplier_ledger);
    res.status(200).json({ newSupplier_ledger: newSupplier_ledger });
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
    const { id, supplier_id, supplier_name, total_amount, total_paid, total_due } = req.body;

    const updatedData = {
      id,
      supplier_id,
      supplier_name,
      total_amount,
      total_paid,
      total_due,
    };

    const updatedSupplier_ledger = await Supplier_ledger.findByIdAndUpdate(
      req.params?.id,
      updatedData,
      { new: true }
    );
    console.log("updatedSupplier_ledger", updatedSupplier_ledger);
    res.status(200).json({ updatedSupplier_ledger: updatedSupplier_ledger });
    if (!updatedSupplier_ledger) {
      return res.status(404).json({ message: "Supplier_ledger not found" });
    }

    // res.json(updatedSupplier_ledger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteSupplier_ledgerData = await Supplier_ledger.findByIdAndDelete(
      req.params?.id
    );
    res.status(200).json({
      message: "Supplier_ledger data deleted successfully!",
      data: deleteSupplier_ledgerData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

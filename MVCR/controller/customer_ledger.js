const model = require("../models/customer_ledger");
const Customer_ledger = model.Customer_ledger;
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

//  (1.) GET : to find the Customer_ledger
exports.get = async (req, res) => {
  try {
    const customer_ledgerLists = await Customer_ledger.find();

    if (customer_ledgerLists && customer_ledgerLists.length > 0) {
      const data = await Promise.all(
        customer_ledgerLists.map(async (item) => {
          return {
            id: item.id,
            customer_id: item.customer_id,
            customer_name: item.customer_name,
            total_balance: item.total_balance,
            total_paid: item.total_paid,
            total_due: item.total_due,
          };
        })
      );
      res.status(200).json({
        msg: "data",
        data: data,
      });
      return;
    }
    res.status(200).json({
      message: "Customer_ledger List",
      data: customer_ledgerLists,
      count: customer_ledgerLists.length,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};
//(2.) POST : to create a new data on database
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
    const { id, customer_id,customer_name, total_balance, total_paid, total_due } = req.body;
    console.log("req.body", req.body);
    // Create the new Customer_ledger
    let newCustomer_ledger = new Customer_ledger({
      id,
      customer_id,
      customer_name,
      total_balance,
      total_paid,
      total_due,
    });
    console.log("newCustomer_ledger", newCustomer_ledger);
    // Save the new Customer_ledger to the database
    newCustomer_ledger = await newCustomer_ledger.save();
    console.log("newCustomer_ledger", newCustomer_ledger);
    res.status(200).json({ newCustomer_ledger: newCustomer_ledger });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// 3). : PUT API
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
      customer_id,
      customer_name,
      total_balance,
      total_paid,
      total_due,
    } = req.body;

    const updatedData = {
      id,
      customer_id,
      customer_name,
      total_balance,
      total_paid,
      total_due,
    };
    const updatedCustomer_ledger = await Customer_ledger.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedCustomer_ledger", updatedCustomer_ledger);
    res.status(200).json({ updatedCustomer_ledger: updatedCustomer_ledger });
    if (!updatedCustomer_ledger) {
      return res.status(404).json({ message: "Customer_ledger not found" });
    }

    // res.json(updatedCustomer_ledger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteCustomer_ledgerData = await Customer_ledger.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json({
      message: "Customer_ledger data deleted successfully!",
      data: deleteCustomer_ledgerData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

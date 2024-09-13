const model = require("../models/purchase_return");
const PurchaseReturn = model.PurchaseReturn;
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer();
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");

// Function to generate custom employment ID
const generatePurchaseReturnId = () => {
  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  // Combine prefix "emp" with the random number
  return `rtn${randomNumber}`;
};

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    // Fetch data from PurchaseReturn collection
    const PurchaseReturnLists = await PurchaseReturn.find({ company_id: req.user?._id });

    if (PurchaseReturnLists && PurchaseReturnLists.length > 0) {
      // Prepare response data
      const data = PurchaseReturnLists.map((item) => ({
        id: item.id,
        sid: item.sid,
        supplier_name: item.supplier_name,
        r_id: item.r_id,
        pur_id: item.pur_id,
        invoice_no: item.invoice_no,
        return_date: item.return_date,
        total_deduction: item.total_deduction,
        total_amount: item.total_amount,
      }));

      res.status(200).json({
        msg: "PurchaseReturn data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in PurchaseReturn collection",
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

//1.1




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


    const r_id = generatePurchaseReturnId();

    // Set entry_date to the current date
    const return_date = new Date().toISOString().split('T')[0];

    // Extract data from the request body
    const {
      id,
      sid,
      supplier_name,
      invoice_no,
      pur_id,
      total_deduction,
      total_amount
    } = req.body;

    console.log("req.body", req.body);
    // Create the new PurchaseReturn
    let newPurchaseReturn = new PurchaseReturn({
      id,
      r_id,
      sid,
      supplier_name,
      invoice_no,
      pur_id,
      return_date,
      total_deduction,
      total_amount,
      company_id: req.user?._id,
    });
    console.log(newPurchaseReturn, "harshit++++s")
    // Save the new PurchaseReturn to the database
    newPurchaseReturn = await newPurchaseReturn.save();
    console.log("newPurchaseReturn", newPurchaseReturn);
    res.status(200).json({ newPurchaseReturn: newPurchaseReturn });
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
      r_id,
      sid,
      invoice_no,
      pur_id,
      return_date,
      total_deduction
    } = req.body;

    const updatedData = {
      id,
      r_id,
      sid,
      invoice_no,
      pur_id,
      return_date,
      total_deduction
    };

    const updatedPurchaseReturn = await PurchaseReturn.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedPurchaseReturn", updatedPurchaseReturn);
    res.status(200).json({ updatedPurchaseReturn: updatedPurchaseReturn });
    if (!updatedPurchaseReturn) {
      return res.status(404).json({ message: "PurchaseReturn not found" });
    }

    // res.json(updatedPurchaseReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deletePurchaseReturnData = await PurchaseReturn.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "PurchaseReturn data deleted successfully!",
      data: deletePurchaseReturnData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

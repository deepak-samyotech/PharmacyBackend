const model = require("../models/Supp_payment.js");
const Supp_payment = model.Supp_payment;
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
    // Fetch data from Supp_payment collection
    const Supp_paymentLists = await Supp_payment.find({ company_id: req.user?._id });

    if (Supp_paymentLists && Supp_paymentLists.length > 0) {
      // Prepare response data
      const data = Supp_paymentLists.map((item) => ({
        id: item.id,
        supp_id: item.supp_id,
        pur_id: item.pur_id,
        type: item.type,
        bank_id: item.bank_id,
        cheque_no: item.cheque_no,
        issue_date: item.issue_date,
        receiver_name: item.receiver_name,
        receiver_contact: item.receiver_contact,
        paid_amount: item.paid_amount,
        date: item.date,

      }));

      res.status(200).json({
        msg: "Supp_payment data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in Supp_payment collection",
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
    const {
      id,
      supp_id,
      pur_id,
      type,
      bank_id,
      cheque_no,
      issue_date,
      receiver_name,
      receiver_contact,
      paid_amount,
      date,

    } = req.body;

    console.log("req.body", req.body);
    // Create the new Supp_payment
    let newSupp_payment = new Supp_payment({
      id,
      supp_id,
      pur_id,
      type,
      bank_id,
      cheque_no,
      issue_date,
      receiver_name,
      receiver_contact,
      paid_amount,
      date,
      company_id: req.user?._id,
    });

    // Save the new Supp_payment to the database
    newSupp_payment = await newSupp_payment.save();
    console.log("newSupp_payment", newSupp_payment);
    res.status(200).json({ newSupp_payment: newSupp_payment });
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
      supp_id,
      pur_id,
      type,
      bank_id,
      cheque_no,
      issue_date,
      receiver_name,
      receiver_contact,
      paid_amount,
      date,
    } = req.body;

    const updatedData = {
      id,
      supp_id,
      pur_id,
      type,
      bank_id,
      cheque_no,
      issue_date,
      receiver_name,
      receiver_contact,
      paid_amount,
      date,
    };

    const updatedSupp_payment = await Supp_payment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedSupp_payment", updatedSupp_payment);
    res.status(200).json({ updatedSupp_payment: updatedSupp_payment });
    if (!updatedSupp_payment) {
      return res.status(404).json({ message: "Supp_payment not found" });
    }

    // res.json(updatedSupp_payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteSupp_paymentData = await Supp_payment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Supp_payment data deleted successfully!",
      data: deleteSupp_paymentData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const bankModel = require("../models/bank");
const Bank = bankModel.Bank;
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

// Function to generate custom employment ID
const generateBankId = () => {
  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  // Combine prefix "emp" with the random number
  return `bank${randomNumber}`;
};

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    const BankLists = await Bank.find();

    if (BankLists && BankLists.length > 0) {
      const data = await Promise.all(
        BankLists.map(async (item) => {
          return {
            id: item.id,
            bank_id: item.bank_id,
            bank_name: item.bank_name,
            account_name: item.account_name,
            account_number: item.account_number,
            branch: item.branch,
            image: `${process.env.IMAGE_BASE_URL}${item.image}`,
          };
        })
      );

      // Count total number of Banks
      //   const totalBanks = BankLists.length;

      res.status(200).json({
        msg: "data",
        data: data,
        // totalBanks: totalBanks,
      });
      return;
    }

    res.status(200).json({
      message: "Bank List",
      data: BankLists,
      //   count: BankLists.length,
      //   totalBanks: 0, // If no Banks found, return count as 0
    });
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

    // Generate custom product ID with prefix "med" and 5-digit number
    const bank_id = generateBankId();

    // Extract data from the request body
    const {
      id,
      bank_name,
      account_name,
      account_number,
      branch,
    } = req.body;

    console.log("req.body", req.body);
    // Create the new customer
    let newBank = new Bank({
      id,
      bank_id,
      bank_name,
      account_name,
      account_number,
      branch,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
      company_id: req.user?._id,
    });
    console.log("newBank", newBank);
    // Save the new customer to the database
    newBank = await newBank.save();
    console.log("newBank", newBank);
    res.status(200).json({ newBank: newBank });
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
      bank_id,
      bank_name,
      account_name,
      account_number,
      branch,
    } = req.body;

    const updatedData = {
      id,
      bank_id,
      bank_name,
      account_name,
      account_number,
      branch,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    };
    const updatedBank = await Bank.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedBank", updatedBank);
    res.status(200).json({ updatedBank: updatedBank });
    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    // res.json(updatedBank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteBankData = await Bank.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Bank data deleted successfully!",
      data: deleteBankData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

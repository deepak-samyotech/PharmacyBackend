const model = require("../models/closing");
const Closing = model.Closing;
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const customId = require("custom-id");
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");


//(1.) GET: to find the Customer
exports.get = async (req, res) => {
  try {
    // Fetch data from Closing collection
    const ClosingLists = await Closing.find();

    if (ClosingLists && ClosingLists.length > 0) {
      // Prepare response data
      const data = ClosingLists.map((item) => ({
        id: item.id,
        date: item.date,
        opening_balance: item.opening_balance,
        cash_in: item.cash_in,
        cash_out: item.cash_out,
        cash_in_hand: item.cash_in_hand,
        closing_balance: item.closing_balance,
        adjustment: item.adjustment,
        entry_id: item.entry_id,
      }));

      res.status(200).json({
        msg: "Closing data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in Closing collection",
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

//(2.) POST: to send the data to the database
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

    // Generate a custom ID using custom-id library
    const customIdOptions = {
      start: "E", // Specify that the ID should start with "E"
    };
    const entry_id = customId(customIdOptions);

    // Extract data from the request body
    const {
      date,
      opening_balance,
      cash_in,
      cash_out,
      cash_in_hand,
      closing_balance,
      adjustment,
    } = req.body;
    console.log("Extract data from the request body", req.body)

    // Create the new Closing
    let newClosing = new Closing({
      date,
      opening_balance,
      cash_in,
      cash_out,
      cash_in_hand,
      closing_balance,
      adjustment,
      entry_id,
      company_id: req.user?._id,
    });
    console.log(" Create the new Closing", newClosing)

    // Save the new Closing to the database
    newClosing = await newClosing.save();
    res.status(200).json({ newClosing: newClosing });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//(3.) PUT: to update the data in the database
exports.put = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      date,
      opening_balance,
      cash_in,
      cash_out,
      cash_in_hand,
      closing_balance,
      adjustment,
      entry_id,
    } = req.body;

    const updatedData = {
      date,
      opening_balance,
      cash_in,
      cash_out,
      cash_in_hand,
      closing_balance,
      adjustment,
      entry_id,
    };

    const updatedClosing = await Closing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    
    if (!updatedClosing) {
      return res.status(404).json({ message: "Closing not found" });
    }

    res.status(200).json({ updatedClosing: updatedClosing });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE: to delete the data from the database
exports.delete = async (req, res) => {
  try {
    const deleteClosingData = await Closing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Closing data deleted successfully!",
      data: deleteClosingData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

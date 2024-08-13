const mongoose = require("mongoose");
const model = require("../models/sale_return.js");
const Sale_return = model.Sale_Return;
const fs = require("fs");
const path = require("path");
const {
  uploadSingleFile,
  removeUploadImage,
} = require("../../utils/upload.js");
const { validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer();

// // Function to generate custom employment ID
// const generateinvoiceNumberId = () => {
//   // Generate a random 11-digit number
//   const randomNumber = Math.floor(10000000000 + Math.random() * 90000000000);
//   // Combine prefix "emp" with the random number
//   return `inv${randomNumber}`;
// };

//  (1.) GET : to find the Sale_return
exports.get = async (req, res) => {
  try {
    const Sale_returnLists = await Sale_return.find();

    if (Sale_returnLists && Sale_returnLists.length > 0) {
      const data = await Promise.all(
        Sale_returnLists.map(async (item) => {
          return {
            id: item.id,
            returnDate: item.returnDate,
            invoiceNumber: item.invoiceNumber,
            sale_id: item.sale_id,
            customerName: item.customerName,
            invoiceDate: item.invoiceDate,
            type: item.type,
            medicineData: item.medicineData,
            customer_id: item.customer_id,
            grandTotal: item.grandTotal,
            grandDeduction: item.grandDeduction,
            totalReturn: item.totalReturn,
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
      message: "Sale_return List",
      data: Sale_returnListsanage_InvoiceLists,
      count: Sale_returnLists.length,
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

    const returnDate = new Date().toISOString().split("T")[0];

    // Extract data from the request body
    const {
      id,
      sale_id,
      invoiceNumber,
      customerName,
      customer_id,
      contact,
      type,
      invoiceDate,
      medicineData,
      grandTotal,
      grandDeduction,
      totalReturn,
    } = req.body;

    // Create the new Sale_return
    let newSale_return = new Sale_return({
      id,
      sale_id,
      returnDate,
      invoiceNumber,
      customerName,
      customer_id,
      contact,
      type,
      invoiceDate,
      medicineData,
      grandTotal,
      grandDeduction,
      totalReturn,
    });

    // Save the new Sale_return to the database
    newSale_return = await newSale_return.save();
    console.log("newSale_return", newSale_return);
    res.status(200).json({ newSale_return: newSale_return });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

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

    // Extract updated data from the request body
    const {
      id,
      sale_id,
      returnDate,
      invoiceNumber,
      customerName,
      customer_id,
      contact,
      type,
      invoiceDate,
      medicineData,
      grandTotal,
      grandDeduction,
      totalReturn,
    } = req.body;

    const updatedData = {
      id,
      sale_id,
      returnDate,
      invoiceNumber,
      customerName,
      customer_id,
      contact,
      type,
      invoiceDate,
      medicineData,
      grandTotal,
      grandDeduction,
      totalReturn,
    };
    const updatedSale_return = await Sale_return.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedSale_return", updatedSale_return);
    res.status(200).json({ updatedSale_return: updatedSale_return });
    if (!updatedSale_return) {
      return res.status(404).json({ message: "Sale_return not found" });
    }

    // res.json(updatedSale_return);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteSale_returnData = await Sale_return.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json({
      message: "Sale_return data deleted successfully!",
      data: deleteSale_returnData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

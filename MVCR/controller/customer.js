const model = require("../models/customer");
const Customer = model.Customer;
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
const generateCustomerId = () => {
  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  // Combine prefix "emp" with the random number
  return `cus${randomNumber}`;
};

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    const customerLists = await Customer.find();

    if (customerLists && customerLists.length > 0) {
      let wholesaleCount = 0;
      let regularCount = 0;

      const data = await Promise.all(
        customerLists.map(async (item) => {
          // Increment wholesaleCount or regularCount based on customer type
          if (item.c_type === "Wholesale") {
            wholesaleCount++;
          } else {
            regularCount++;
          }

          return {
            id: item.id,
            c_id: item.c_id,
            c_name: item.c_name,
            pharmacy_name: item.pharmacy_name,
            c_email: item.c_email,
            c_type: item.c_type,
            barcode: item.barcode,
            cus_contact: item.cus_contact,
            c_address: item.c_address,
            c_note: item.c_note,
            regular_discount: item.regular_discount,
            target_amount: item.target_amount,
            target_discount: item.target_discount,
            entry_date: item.entry_date,
            image: `${process.env.IMAGE_BASE_URL}${item.image}`,
          };
        })
      );

      res.status(200).json({
        msg: "data",
        data: data,
        wholesaleCount: wholesaleCount,
        regularCount: regularCount,
      });
      return;
    }
    res.status(200).json({
      message: "Customer List",
      data: customerLists,
      count: customerLists.length,
      wholesaleCount: 0,
      regularCount: 0,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

// exports.get = async (req, res) => {
//   try {
//     const customerLists = await Customer.find();

//     if (customerLists && customerLists.length > 0) {
//       const data = await Promise.all(
//         customerLists.map(async (item) => {
//           return {
//             id: item.id,
//             c_id: item.c_id,
//             c_name: item.c_name,
//             pharmacy_name: item.pharmacy_name,
//             c_email: item.c_email,
//             c_type: item.c_type,
//             barcode: item.barcode,
//             cus_contact: item.cus_contact,
//             c_address: item.c_address,
//             c_note: item.c_note,
//             regular_discount: item.regular_discount,
//             target_amount: item.target_amount,
//             target_discount: item.target_discount,
//             entry_date: item.entry_date,
//             image: `${process.env.IMAGE_BASE_URL}${item.image}`,
//           };
//         })
//       );
//       res.status(200).json({
//         msg: "data",
//         data: data,
//       });
//       return;
//     }
//     res.status(200).json({
//       message: "Customer List",
//       data: customerLists,
//       count: customerLists.length,
//     });
//   } catch (err) {
//     res.status(404).json(err);
//   }
// };
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

    // Generate custom product ID with prefix "med" and 5-digit number
    const c_id = generateCustomerId();

    // Extract data from the request body
    const {
      id,
      c_name,
      pharmacy_name,
      c_email,
      c_type,
      barcode,
      cus_contact,
      c_address,
      c_note,
      regular_discount,
      target_amount,
      target_discount,
      entry_date,
    } = req.body;
    console.log("req.body", req.body);
    // Create the new customer
    let newCustomer = new Customer({
      id,
      c_id,
      c_name,
      pharmacy_name,
      c_email,
      c_type,
      barcode,
      cus_contact,
      c_address,
      c_note,
      regular_discount,
      target_amount,
      target_discount,
      entry_date,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    });
    console.log("newCustomer", newCustomer);
    // Save the new customer to the database
    newCustomer = await newCustomer.save();
    console.log("newCustomer", newCustomer);
    res.status(200).json({ newCustomer: newCustomer });
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
      c_id,
      c_name,
      pharmacy_name,
      c_email,
      c_type,
      barcode,
      cus_contact,
      c_address,
      c_note,
      regular_discount,
      target_amount,
      target_discount,
      entry_date,
    } = req.body;

    const updatedData = {
      id,
      c_id,
      c_name,
      pharmacy_name,
      c_email,
      c_type,
      barcode,
      cus_contact,
      c_address,
      c_note,
      regular_discount,
      target_amount,
      target_discount,
      entry_date,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    };
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedCustomer", updatedCustomer);
    res.status(200).json({ updatedCustomer: updatedCustomer });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteCustomerData = await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Customer data deleted successfully!",
      data: deleteCustomerData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//(5) search Api for finding data according to barcode and productID

exports.search = async (req, res) => {
  try {
    const { cus_contact } = req.query;

    let query = {};

    if (cus_contact) {
      query.cus_contact = cus_contact;
    }

    // const medicines = await Medicine.find(query).select('product_name');
    const customer = await Customer.find(query).select(
      "c_id c_name pharmacy_name c_email c_type barcode cus_contact c_address c_note regular_discount target_amount target_discount entry_date"
    );

    res.status(200).json({ customer });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const mongoose = require("mongoose");
const model = require("../models/manageInvoice");
const Manage_Invoice = model.Manage_Invoice;
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
const generateInvoiceIdId = () => {
  // Generate a random 11-digit number
  const randomNumber = Math.floor(10000000000 + Math.random() * 90000000000);
  // Combine prefix "emp" with the random number
  return `inv${randomNumber}`;
};

const generateSaleId = () => {
  // Generate a random 11-digit number
  const randomNumber = Math.floor(10000000000 + Math.random() * 90000000000);
  // Combine prefix "emp" with the random number
  return `sid${randomNumber}`;
};

//  (1.) GET : to find the Manage_Invoice
exports.get = async (req, res) => {
  try {
    const manage_InvoiceLists = await Manage_Invoice.find({ company_id: req.user?._id });

    if (manage_InvoiceLists && manage_InvoiceLists.length > 0) {
      const data = await Promise.all(
        manage_InvoiceLists.map(async (item) => {
          return {
            id: item.id,
            invoiceId: item.invoiceId,
            sale_id: item.sale_id,
            customer_id: item.customer_id,
            customerName: item.customerName,
            contact: item.contact,
            customerType: item.customerType,
            createDate: item.createDate,
            medicineData: item.medicineData,
            grand_total: item.grand_total,
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
      message: "Manage_Invoice List",
      data: manage_InvoiceListsanage_InvoiceLists,
      count: manage_InvoiceLists.length,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

// (1.1) find the current date data
exports.getTodaySale = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Get current date string in YYYY-MM-DD format

    const manage_InvoiceLists = await Manage_Invoice.find({
      company_id: req.user?._id,
      createDate: { $gte: currentDateString, $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    });

    if (manage_InvoiceLists && manage_InvoiceLists.length > 0) {
      const data = manage_InvoiceLists.map((item) => ({
        id: item.id,
        createDate: currentDateString, // Keep the same date format
        invoiceId: item.invoiceId,
        customerName: item.customerName,
        grand_total: item.grand_total,
      }));

      res.status(200).json({
        msg: "data",
        data: data,
      });
      return;
    }
    res.status(200).json({
      message: "No data found for today's date.",
      data: [],
      count: 0,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

//1.2  gettin overall sale data
exports.getTotalSale = async (req, res) => {
  try {

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = {};

    // Filter by date range if start and end dates are provided
    if (startDate && endDate) {
      query.createDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const manage_InvoiceLists = await Manage_Invoice.find({ company_id: req.user?._id, query });

    if (manage_InvoiceLists && manage_InvoiceLists.length > 0) {
      const data = await Promise.all(
        manage_InvoiceLists.map(async (item) => {
          // Calculate Total Amount from medicineData
          const totalAmount = item.medicineData.reduce((acc, curr) => {
            return acc + parseFloat(curr.product_total);
          }, 0);

          return {
            createDate: item.createDate,
            invoiceNumber: item.invoiceId,
            supplierName: item.customerName,
            totalAmount: totalAmount.toFixed(2), // Format totalAmount to two decimal places
          };
        })
      );
      res.status(200).json({
        msg: "Data retrieved successfully",
        data: data,
      });
      return;
    }
    res.status(200).json({
      message: "No Manage_Invoice data found",
      data: [],
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get invoice by id
exports.getInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    const invoiceData = await Manage_Invoice.findById(invoiceId);

    if (!invoiceData) {
      return res.status(404).json({
        success: false,
        error: "Invalid invoice Id"
      })
    }

    res.status(200).json({
      success: true,
      invoiceData,
      message: "Invoice data fetched successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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

    // Generate custom invoice number ID with prefix "med" and 5-digit number
    const invoiceId = generateInvoiceIdId();
    const sale_id = generateSaleId();


    // Extract data from the request body
    const {
      id,
      customerName,
      customer_id,
      contact,
      customerType,
      createDate,
      medicineData, // Change from medicineList to medicineData
      grand_total,
      total_paid,
      total_due,
    } = req.body;

    // Create the new Manage_Invoice
    let newManage_Invoice = new Manage_Invoice({
      id,
      invoiceId,
      sale_id,
      customerName,
      customer_id,
      contact,
      customerType,
      createDate,
      medicineData,
      grand_total,
      total_paid,
      total_due,
      company_id: req.user?._id,
    });

    // Save the new Manage_Invoice to the database
    newManage_Invoice = await newManage_Invoice.save();
    console.log("newManage_Invoice", newManage_Invoice);
    res.status(200).json({ newManage_Invoice: newManage_Invoice });
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
      invoiceId,
      sale_id,
      customerName,
      customer_id,
      contact,
      customerType,
      createDate,
      medicineData,
      grand_total,
      total_paid,
      total_due,
    } = req.body;

    const updatedData = {
      id,
      sale_id,
      invoiceId,
      customerName,
      customer_id,
      contact,
      customerType,
      createDate,
      medicineData,
      grand_total,
      total_paid,
      total_due,
    };
    const updatedManage_Invoice = await Manage_Invoice.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedManage_Invoice", updatedManage_Invoice);
    res.status(200).json({ updatedManage_Invoice: updatedManage_Invoice });
    if (!updatedManage_Invoice) {
      return res.status(404).json({ message: "Manage_Invoice not found" });
    }

    // res.json(updatedManage_Invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteManage_InvoiceData = await Manage_Invoice.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json({
      message: "Manage_Invoice data deleted successfully!",
      data: deleteManage_InvoiceData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


exports.updateReturnQuantities = async (invoiceId, medicineData) => {
  try {
    const result = await Manage_Invoice.findById(invoiceId);

    if (!result) {
      return {
        success: false,
        error: "Document not found",
      };
    }

    // Update individual returnQty values
    const values = medicineData.map(async (medicine) => {
      try {
        const medicineInDoc = result.medicineData.find(m => m.medicine_id.toString() === medicine.medicine_id);
        if (medicineInDoc) {
          const currentReturnQty = parseInt(medicineInDoc.prevReturnQty) || 0;
          const newReturnQty = parseInt(medicine.returnQty) || 0;
          const updatedReturnQty = currentReturnQty + newReturnQty;

          return await Manage_Invoice.findOneAndUpdate(
            {
              _id: invoiceId,
              'medicineData.medicine_id': medicine.medicine_id
            },
            {
              $set: {
                'medicineData.$.prevReturnQty': updatedReturnQty.toString()
              }
            },
            { new: true }
          );
        }
      } catch (error) {
        console.error(`Failed to update medicine return Quantity`, error);
      }
    });

    await Promise.all(values);

    return {
      success: true,
      message: "New Quantities updated",
    };

  } catch (error) {
    console.error('Error updating document:', error);
    return {
      success: true,
      error: `Error updating document: ${error}`,
    };
  }
}
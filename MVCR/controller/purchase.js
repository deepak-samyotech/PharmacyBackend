const model = require("../models/purchase");
const Purchase = model.Purchase;
const Supplier_ledger = require("../models/supplier_ledger.js");
const supplier = require("../models/supplier");
const supplier_payment = require("../models/Supp_payment");
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

const generatePurchaseId = () => {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `pur${randomNumber}`;
};

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    const purchaseLists = await Purchase.find();
    if (purchaseLists && purchaseLists.length > 0) {
      const data = purchaseLists.map((item) => ({
        id: item.id,
        p_id: item.p_id,
        sid: item.sid,
        supplier_name: item.supplier_name,
        invoice_no: item.invoice_no,
        pur_date: item.pur_date,
        pur_details: item.pur_details,
        total_discount: item.total_discount,
        gtotal_amount: item.gtotal_amount,
        entry_date: item.entry_date,
        entry_id: item.entry_id,
      }));

      res.status(200).json({
        msg: "Purchase data",
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No data found in Purchase collection",
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

//(1.1)
exports.getTodayPurchase = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const result = await Purchase.aggregate([
      {
        $match: {
          entry_date: currentDate,
        },
      },
      {
        $lookup: {
          from: "supplier_ledgers",
          localField: "sid",
          foreignField: "sid",
          as: "supplierData",
        },
      },
      {
        $addFields: {
          supplier_name: "$supplierData.supplier_name",
          total_amount: "$supplierData.total_amount",
        },
      },
      {
        $project: {
          invoice_no: 1,
          entry_date: 1,
          supplier_name: 1,
          total_amount: 1,
        },
      },
    ]);

    if (result && result.length > 0) {
      res.status(200).json({
        msg: "data",
        data: result,
      });
    } else {
      res.status(200).json({
        message: "No data found",
        data: [],
        count: 0,
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

// GET: Get Purchase Billing with Supplier Data and Payment Details
exports.getPurchaseBilling = async (req, res) => {
  try {
    // const purchaseLists = await Purchase.aggregate([
    //   {
    //     $lookup: {
    //       from: "suppliers",
    //       localField: "sid",
    //       foreignField: "s_id",
    //       as: "supplierData",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "supp_payments",
    //       localField: "sid",
    //       foreignField: "supp_id",
    //       as: "paymentData",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$supplierData",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$paymentData",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $addFields: {
    //       supplier_name: { $ifNull: ["$supplierData.s_name", ""] },
    //       supplier_email: { $ifNull: ["$supplierData.s_email", ""] },
    //       supplier_address: { $ifNull: ["$supplierData.s_address", ""] },
    //       supplier_phone: { $ifNull: ["$supplierData.s_phone", ""] },

    //       payment_receiver_name: { $ifNull: ["$paymentData.receiver_name", ""],},
    //       payment_receiver_contact: { $ifNull: ["$paymentData.receiver_contact", ""],},
    //       payment_paid_amount: { $ifNull: ["$paymentData.paid_amount", ""] },
    //       payment_date: { $ifNull: ["$paymentData.date", ""] },
    //     },
    //   },
    //   {
    //     $project: {
    //       id: 1,
    //       p_id: 1,
    //       sid: 1,
    //       supplier_name: 1,
    //       supplier_email: 1,
    //       supplier_address: 1,
    //       supplier_phone: 1,
    //       invoice_no: 1,
    //       pur_date: 1,
    //       pur_details: 1,
    //       total_discount: 1,
    //       gtotal_amount: 1,
    //       entry_date: 1,
    //       entry_id: 1,
    //       payment_receiver_name: 1,
    //       payment_receiver_contact: 1,
    //       payment_paid_amount: 1,
    //       payment_date: 1,
    //     },
    //   },
    // ]);

    const purchaseLists = await Purchase.aggregate([
      {
        $lookup: {
          from: "suppliers",
          localField: "sid",
          foreignField: "s_id",
          as: "supplierData",
        },
      },
      {
        $lookup: {
          from: "supp_payments",
          localField: "sid",
          foreignField: "supp_id",
          as: "paymentData",
        },
      },
      {
        $addFields: {
          supplierData: { $arrayElemAt: ["$supplierData", 0] },
          paymentData: { $arrayElemAt: ["$paymentData", 0] },
        },
      },
      {
        $addFields: {
          supplier_name: { $ifNull: ["$supplierData.s_name", ""] },
          supplier_email: { $ifNull: ["$supplierData.s_email", ""] },
          supplier_address: { $ifNull: ["$supplierData.s_address", ""] },
          supplier_phone: { $ifNull: ["$supplierData.s_phone", ""] },
    
          payment_receiver_name: { $ifNull: ["$paymentData.receiver_name", ""] },
          payment_receiver_contact: { $ifNull: ["$paymentData.receiver_contact", ""] },
          payment_paid_amount: { $ifNull: ["$paymentData.paid_amount", ""] },
          payment_date: { $ifNull: ["$paymentData.date", ""] },
        },
      },
      {
        $project: {
          id: 1,
          p_id: 1,
          sid: 1,
          supplier_name: 1,
          supplier_email: 1,
          supplier_address: 1,
          supplier_phone: 1,
          invoice_no: 1,
          pur_date: 1,
          pur_details: 1,
          total_discount: 1,
          gtotal_amount: 1,
          entry_date: 1,
          entry_id: 1,
          payment_receiver_name: 1,
          payment_receiver_contact: 1,
          payment_paid_amount: 1,
          payment_date: 1,
        },
      },
    ]);
    
     console.log("Purchase list : ",purchaseLists);
    if (purchaseLists && purchaseLists.length > 0) {
      res.status(200).json({
        msg: "Purchase data",
        data: purchaseLists,
      });
    } else {
      res.status(200).json({
        message: "No data found in Purchase collection",
      });
    }
  } catch (err) {
    console.error("Error in getPurchaseBilling:", err);
    res.status(500).json({ error: err.message });
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

    const p_id = generatePurchaseId();

    const entry_date = new Date().toISOString().split("T")[0];

    const {
      id,
      sid,
      supplier_name,
      invoice_no,
      pur_date,
      pur_details,
      total_discount,
      gtotal_amount,
      entry_id,
    } = req.body;

    console.log("req.body", req.body);
    let newPurchase = new Purchase({
      id,
      p_id,
      sid,
      supplier_name,
      invoice_no,
      pur_date,
      pur_details,
      total_discount,
      gtotal_amount,
      entry_date,
      entry_id,
      company_id:req.user?._id,
    });
    console.log(newPurchase, "harshit++++s");
    newPurchase = await newPurchase.save();
    console.log("newPurchase", newPurchase);
    res.status(200).json({ newPurchase: newPurchase });
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
      p_id,
      sid,
      supplier_name,
      invoice_no,
      pur_date,
      pur_details,
      total_discount,
      gtotal_amount,
      entry_date,
      entry_id,
    } = req.body;

    const updatedData = {
      id,
      p_id,
      sid,
      supplier_name,
      invoice_no,
      pur_date,
      pur_details,
      total_discount,
      gtotal_amount,
      entry_date,
      entry_id,
    };

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedPurchase", updatedPurchase);
    res.status(200).json({ updatedPurchase: updatedPurchase });
    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deletePurchaseData = await Purchase.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Purchase data deleted successfully!",
      data: deletePurchaseData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

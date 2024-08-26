const medicineModel = require("../models/medicine");
const Medicine = medicineModel.Medicine;
const supplierModel = require("../models/supplier.js");
const Supplier = supplierModel.Supplier;
const model = require("../models/posConfigure");
const PosConfigureData = model.PosConfigureData;

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
const generateProductId = () => {
  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  // Combine prefix "emp" with the random number
  return `med${randomNumber}`;
};

//  (1.) GET : to find the Customer
exports.get = async (req, res) => {
  try {
    const medicineLists = await Medicine.find();

    if (medicineLists && medicineLists.length > 0) {
      const data = await Promise.all(
        medicineLists.map(async (item) => {
          return {
            id: item.id,
            product_id: item.product_id,
            supplier_id: item.supplier_id,
            supplier_name: item.supplier_name,
            batch_no: item.batch_no,
            product_name: item.product_name,
            generic_name: item.generic_name,
            strength: item.strength,
            form: item.form,
            box_size: item.box_size,
            trade_price: item.trade_price,
            mrp: item.mrp,
            barcode: item.barcode,
            box_price: item.box_price,
            product_details: item.product_details,
            side_effect: item.side_effect,
            expire_date: item.expire_date,
            instock: item.instock,
            short_stock: item.short_stock,
            w_discount: item.w_discount,
            favourite: item.favourite,
            discount: item.discount,
            sale_qty: item.sale_qty,
            image: `${process.env.IMAGE_BASE_URL}${item.image}`,
            posStatus: item.posStatus
          };
        })
      );

      // Count total number of medicines
      const totalMedicines = medicineLists.length;

      res.status(200).json({
        msg: "data",
        data: data,
        totalMedicines: totalMedicines,
      });
      return;
    }

    res.status(200).json({
      message: "Medicine List",
      data: medicineLists,
      count: medicineLists.length,
      totalMedicines: 0, // If no medicines found, return count as 0
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

//(1.1)get data from supplier file
exports.getSupplierData = async (req, res) => {
  try {
    const data = req.params.data;
    const suppliers = await Supplier.aggregate([
      {
        $project: {
          _id: 1, // include the _id field
          suppler_Id: "$s_id",
          supplier_name: "$s_name", // include the name field as s_name
        },
      },
    ]);
    res.status(200).json({
      message: "supplier List",
      data: { suppliers },
      count: suppliers.length,
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail to fetch supplier data",
      message: err.message,
    });
  }
};

//(1.2) GET Api for finding data according to supplier/Company name

exports.getBySupplierName = async (req, res) => {
  try {
    const supplierName = req.query.supplier_name;
    if (!supplierName) {
      return res
        .status(400)
        .json({ message: "Please provide a supplier_name" });
    }

    const medicineLists = await Medicine.find({ supplier_name: supplierName });

    if (!medicineLists || medicineLists.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for supplier: " + supplierName });
    }

    const data = medicineLists.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      supplier_id: item.supplier_id,
      supplier_name: item.supplier_name,
      batch_no: item.batch_no,
      product_name: item.product_name,
      generic_name: item.generic_name,
      strength: item.strength,
      form: item.form,
      box_size: item.box_size,
      trade_price: item.trade_price,
      mrp: item.mrp,
      barcode: item.barcode,
      box_price: item.box_price,
      product_details: item.product_details,
      side_effect: item.side_effect,
      expire_date: item.expire_date,
      instock: item.instock,
      w_discount: item.w_discount,
      favourite: item.favourite,
      discount: item.discount,
      sale_qty: item.sale_qty,
      image: `${process.env.IMAGE_BASE_URL}${item.image}`,
    }));

    return res.status(200).json({
      msg: "Data for supplier: " + supplierName,
      data: data,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
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
    const product_id = generateProductId();

    // Extract data from the request body
    const {
      id,
      supplier_id,
      supplier_name,
      batch_no,
      product_name,
      generic_name,
      strength,
      form,
      box_size,
      trade_price,
      mrp,
      barcode,
      box_price,
      product_details,
      side_effect,
      expire_date,
      instock,
      short_stock,
      w_discount,
      favourite,
      discount,
      sale_qty,
    } = req.body;

    console.log("req.body", req.body);
    // Create the new customer
    let newMedicine = new Medicine({
      id,
      product_id,
      supplier_id,
      supplier_name,
      batch_no,
      product_name,
      generic_name,
      strength,
      form,
      box_size,
      trade_price,
      mrp,
      barcode,
      box_price,
      product_details,
      side_effect,
      expire_date,
      instock,
      short_stock,
      w_discount,
      favourite,
      discount,
      sale_qty,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    });
    console.log("newMedicine", newMedicine);
    // Save the new customer to the database
    newMedicine = await newMedicine.save();
    console.log("newMedicine", newMedicine);
    res.status(200).json({ newMedicine: newMedicine });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//(1.2) search Api for finding data according to barcode and productID

exports.search = async (req, res) => {
  try {
    // const { barcode, product_id } = req.query;

    // let query = {};

    // if (barcode) {
    //   query.barcode = barcode;
    // }

    // if (product_id) {
    //   query.product_id = product_id;
    // }

    // // const medicines = await Medicine.find(query).select('product_name');
    // const medicines = await Medicine.find(query).select('product_id supplier_id supplier_name batch_no product_name generic_name strength form box_size trade_price mrp barcode box_price product_details side_effect expire_date instock w_discount favourite date discount sale_qty');

    // console.log(medicines);

    // res.status(200).json({ medicines });

    // -------------------------------------------------------
    // console.log(req.query);

    const { barcode, product_id } = req.query;

    let query = {};

    if (barcode) {
      query.barcode = barcode;
    }

    if (product_id) {
      query.value = product_id;
    }

    const medicine = await PosConfigureData.find({ ...query, active: true }).populate('productId').select('product_id supplier_id supplier_name batch_no product_name generic_name strength form box_size trade_price mrp barcode box_price product_details side_effect expire_date instock w_discount favourite date discount sale_qty');

    let medicines = [medicine[0].productId]
    // console.log(medicines);

    res.status(200).json({ medicines });

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
      product_id,
      supplier_id,
      supplier_name,
      batch_no,
      product_name,
      generic_name,
      strength,
      form,
      box_size,
      trade_price,
      mrp,
      barcode,
      box_price,
      product_details,
      side_effect,
      expire_date,
      instock,
      w_discount,
      favourite,
      discount,
      sale_qty,
    } = req.body;

    const updatedData = {
      id,
      product_id,
      supplier_id,
      supplier_name,
      batch_no,
      product_name,
      generic_name,
      strength,
      form,
      box_size,
      trade_price,
      mrp,
      barcode,
      box_price,
      product_details,
      side_effect,
      expire_date,
      instock,
      w_discount,
      favourite,
      discount,
      sale_qty,
      image:
        respUpload.files && respUpload.files.length > 0
          ? respUpload.files[0].filename
          : "",
    };
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    console.log("updatedMedicine", updatedMedicine);
    res.status(200).json({ updatedMedicine: updatedMedicine });
    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // res.json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//(4.) DELETE : to delete the data on database
exports.delete = async (req, res) => {
  try {
    const deleteMedicineData = await Medicine.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Medicine data deleted successfully!",
      data: deleteMedicineData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateQuantity = async (req, res) => {
  try {

    const newQuantityArr = req.body;

    if (!newQuantityArr) {
      return res.status(400).json({
        success: false,
        error: "Atleast one Quantity needed to update Quantity"
      })
    }



    const values = newQuantityArr?.map( element => {
      return Medicine.updateOne(
        { _id: element?._id },
        { $set: { instock: element?.ProductNewQuantity } }
      )
    });

    await Promise.all(values);

    res.status(200).json({
      success: true,
      message: "New Quantities updated"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  }
}

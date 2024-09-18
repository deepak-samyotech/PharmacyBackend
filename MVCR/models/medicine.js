const mongoose = require("mongoose");
const { Schema } = mongoose;

const medicineSchema = new Schema({
  supplier_id: {
    type: String,
    default: null,
  },
  supplier_name: {
    //company name
    type: String,
    default: null,
  },
  product_id: {
    type: String,
    default: null,
  },
  batch_no: {
    type: String,
    default: null,
  },
  product_name: {
    //medicine name
    type: String,
    default: null,
  },
  generic_name: {
    type: String,
    default: null,
  },
  strength: {
    type: String,
    default: null,
  },
  form: {
    type: String,
    default: null,
  },
  box_size: {
    type: Number,
    min: 0,
    default: 0,
  },
  trade_price: {
    type: Number,
    min: 0,
    default: 0,
  },
  mrp: {
    type: Number,
    min: 0,
    default: 0,
  },
  box_price: {
    type: Number,
    min: 0,
    default: 0,
  },
  product_details: {
    type: String,
    default: null,
  },
  side_effect: {
    type: String,
    default: null,
  },
  expire_date: {
    type: String,
    default: null,
  },
  instock: {
    type: Number,
    default: 0,
  },
  w_discount: {
    type: String,
    default: 0,
  },
  image: {
    type: String,
  },
  barcode: {
    type: String,
    default: null,
  },
  short_stock: {
    type: Number,
    default: 0,
  },
  favourite: {
    type: String,
    enum: ["1", "0"],
    default: "0",
  },
  discount: {
    type: String,
    enum: ["Yes", "No"], // Restricts the field to only accept 'Yes' or 'No' values
    default: "Yes",
  },
  sale_qty: {
    type: Number,
    default: 0,
  },
  posStatus: {
    type: Boolean,
    default: false
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  employee_id:{
    type: Schema.Types.ObjectId,
    ref: "CreateEmployee",
    default: null,
  }
});

exports.Medicine = mongoose.model("Medicine", medicineSchema);
